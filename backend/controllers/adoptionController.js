const db           = require('../config/database');
const multer       = require('multer');
const path         = require('path');
const emailService = require('../services/emailService');

// ── Inline notification helper ────────────────────────────────
async function createNotification(userId, title, message, type = 'default') {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, notification_type)
       VALUES (?, ?, ?, ?)`,
      [userId, title, message, type]
    );
  } catch (err) {
    console.warn('createNotification warning:', err.message);
  }
}

// ── Multer — 25 MB limit ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/documents/'),
  filename:    (req, file, cb) => {
    const id = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'doc-' + id + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pdf', '.jpg', '.jpeg', '.png'].includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, JPG, JPEG, PNG allowed'));
  },
});

const adoptionController = {

  // ── Get required documents ────────────────────────────────
  getRequiredDocuments: async (req, res) => {
    try {
      const { country = 'Sri Lanka' } = req.query;
      const [docs] = await db.query(
        `SELECT * FROM adoption_documents WHERE country = ?
         ORDER BY is_mandatory DESC, display_order ASC`,
        [country]
      );
      res.json({ success: true, count: docs.length, data: docs });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch documents' });
    }
  },

  // ── Initiate adoption ─────────────────────────────────────
  initiateAdoption: async (req, res) => {
    try {
      const { orphanageId } = req.body;
      const userId = req.user.userId;

      const [existing] = await db.query(
        `SELECT application_id FROM adoption_applications
         WHERE user_id = ? AND orphanage_id = ?
           AND application_status NOT IN ('rejected','completed')`,
        [userId, orphanageId]
      );
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'You already have an active application for this orphanage',
          applicationId: existing[0].application_id,
        });
      }

      const expectedDate = new Date();
      expectedDate.setMonth(expectedDate.getMonth() + 6);

      const [result] = await db.query(
        `INSERT INTO adoption_applications
          (user_id, orphanage_id, application_status,
           expected_completion_date, current_stage)
         VALUES (?, ?, 'initiated', ?, 'Document Preparation')`,
        [userId, orphanageId, expectedDate.toISOString().split('T')[0]]
      );
      const applicationId = result.insertId;

      const STAGES = [
        { name:'Document Preparation',          order:1, days:0   },
        { name:'Initial Application Submission', order:2, days:14  },
        { name:'Background Check',               order:3, days:30  },
        { name:'Home Study Evaluation',          order:4, days:60  },
        { name:'Legal Review',                   order:5, days:120 },
        { name:'Final Approval',                 order:6, days:150 },
        { name:'Child Placement',                order:7, days:180 },
      ];

      for (const s of STAGES) {
        await db.query(
          `INSERT INTO adoption_timeline
            (application_id, stage_name, stage_order, expected_date, status)
           VALUES (?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), ?)`,
          [applicationId, s.name, s.order, s.days,
           s.order === 1 ? 'in_progress' : 'pending']
        );
      }

      const [[user]] = await db.query(
        'SELECT email, first_name, last_name FROM users WHERE user_id = ?', [userId]
      );
      const [[orp]] = await db.query(
        'SELECT name, email FROM orphanages WHERE orphanage_id = ?', [orphanageId]
      );

      await createNotification(
        userId,
        'Adoption Application Started',
        `Your adoption journey with ${orp?.name || 'the orphanage'} has begun! Upload your documents to proceed.`,
        'adoption_update'
      );

      if (user?.email) {
        emailService.sendApplicationInitiatedEmail(
          user.email, user.first_name, orp?.name || 'the orphanage',
          applicationId,
          expectedDate.toLocaleDateString('en-LK', { year:'numeric', month:'long', day:'numeric' })
        ).catch(() => {});
      }

      if (orp?.email) {
        emailService.sendBookingNotificationToOrphanage(
          orp.email, orp.name,
          `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'A family',
          'adoption', null,
          '<p style="margin:0;font-size:13px;color:#504E5E;">A family has initiated an adoption application.</p>'
        ).catch(() => {});
      }

      await db.query(
        `INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, description)
         VALUES (?, 'ADOPTION_INITIATED', 'adoption_application', ?, ?)`,
        [userId, applicationId, 'User initiated adoption application']
      ).catch(() => {});

      res.status(201).json({
        success: true,
        message: 'Adoption application initiated successfully',
        applicationId,
      });
    } catch (err) {
      console.error('initiateAdoption error:', err);
      res.status(500).json({ success: false, message: 'Failed to initiate adoption' });
    }
  },

  // ── Get my applications ───────────────────────────────────
  getMyApplications: async (req, res) => {
    try {
      const userId = req.user.userId;
      const [apps] = await db.query(
        `SELECT aa.*,
                o.name AS orphanage_name, o.city AS orphanage_city,
                o.phone AS orphanage_phone, o.email AS orphanage_email,
                o.latitude, o.longitude,
                (SELECT COUNT(*) FROM user_documents ud WHERE ud.application_id = aa.application_id) AS uploaded_documents,
                (SELECT COUNT(*) FROM adoption_timeline at2
                 WHERE at2.application_id = aa.application_id AND at2.status='completed') AS completed_stages,
                (SELECT COUNT(*) FROM adoption_timeline at2
                 WHERE at2.application_id = aa.application_id) AS total_stages
         FROM adoption_applications aa
         JOIN orphanages o ON aa.orphanage_id = o.orphanage_id
         WHERE aa.user_id = ?
         ORDER BY aa.initiated_date DESC`,
        [userId]
      );
      res.json({ success: true, count: apps.length, data: apps });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch applications' });
    }
  },

  // ── Get application timeline ──────────────────────────────
  getApplicationTimeline: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const userId = req.user.userId;

      const [apps] = await db.query(
        `SELECT aa.*, o.name AS orphanage_name, o.latitude, o.longitude,
                o.address, o.city, o.phone AS orphanage_phone
         FROM adoption_applications aa
         JOIN orphanages o ON aa.orphanage_id = o.orphanage_id
         WHERE aa.application_id = ? AND aa.user_id = ?`,
        [applicationId, userId]
      );
      if (apps.length === 0) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      const [timeline] = await db.query(
        'SELECT * FROM adoption_timeline WHERE application_id = ? ORDER BY stage_order',
        [applicationId]
      );

      const [documents] = await db.query(
        `SELECT ud.*, ad.document_name, ad.is_mandatory,
                ud.approved_by_childcare, ud.childcare_notes
         FROM user_documents ud
         JOIN adoption_documents ad ON ud.document_id = ad.document_id
         WHERE ud.application_id = ?
         ORDER BY ud.upload_date DESC`,
        [applicationId]
      );

      res.json({ success: true, application: apps[0], timeline, documents });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch timeline' });
    }
  },

  // ── Upload document ───────────────────────────────────────
  uploadDocument: [
    upload.single('document'),
    async (req, res) => {
      try {
        const { applicationId, documentId, documentName } = req.body;
        const userId = req.user.userId;

        const [apps] = await db.query(
          'SELECT application_id, orphanage_id FROM adoption_applications WHERE application_id = ? AND user_id = ?',
          [applicationId, userId]
        );
        if (apps.length === 0) {
          return res.status(404).json({ success: false, message: 'Application not found' });
        }
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const filePath = req.file.path.replace(/\\/g, '/');
        const fileUrl  = `uploads/${filePath.split('uploads/').pop()}`;

        await db.query(
          `INSERT INTO user_documents
            (application_id, document_id, file_path, file_name, file_size_bytes, verification_status)
           VALUES (?, ?, ?, ?, ?, 'pending')
           ON DUPLICATE KEY UPDATE
             file_path = VALUES(file_path), file_name = VALUES(file_name),
             file_size_bytes = VALUES(file_size_bytes),
             verification_status = 'pending', upload_date = NOW()`,
          [applicationId, documentId, filePath, req.file.originalname, req.file.size]
        );

        const [[user]] = await db.query(
          'SELECT email, first_name FROM users WHERE user_id = ?', [userId]
        );
        const [[orp]] = await db.query(
          `SELECT o.name FROM orphanages o
           JOIN adoption_applications aa ON o.orphanage_id = aa.orphanage_id
           WHERE aa.application_id = ?`,
          [applicationId]
        );

        const docName = documentName || req.file.originalname;

        await createNotification(userId,
          'Document Uploaded',
          `"${docName}" has been uploaded and is pending verification by Childcare Services.`,
          'document_uploaded'
        );

        if (user?.email) {
          emailService.sendDocumentUploadedEmail(
            user.email, user.first_name, docName, applicationId, orp?.name || 'the orphanage'
          ).catch(() => {});
        }

        res.json({
          success: true,
          message: 'Document uploaded successfully',
          fileUrl,
          fileName: req.file.originalname,
        });
      } catch (err) {
        console.error('uploadDocument error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File too large. Maximum size is 25 MB.' });
        }
        res.status(500).json({ success: false, message: 'Failed to upload document' });
      }
    },
  ],

  // ── Childcare: get pending documents ──────────────────────
  getPendingDocuments: async (req, res) => {
    try {
      const [docs] = await db.query(
        `SELECT ud.*,
                aa.application_id, aa.application_status,
                u.first_name, u.last_name, u.email AS user_email,
                o.name AS orphanage_name,
                ad.document_name
         FROM user_documents ud
         JOIN adoption_applications aa ON ud.application_id = aa.application_id
         JOIN users u ON aa.user_id = u.user_id
         JOIN orphanages o ON aa.orphanage_id = o.orphanage_id
         JOIN adoption_documents ad ON ud.document_id = ad.document_id
         WHERE ud.verification_status = 'pending'
         ORDER BY ud.upload_date DESC`
      );
      res.json({ success: true, count: docs.length, data: docs });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch pending documents' });
    }
  },

  // ── Childcare: approve or reject a document ───────────────
  reviewDocument: async (req, res) => {
    try {
      const { uploadId } = req.params;
      const { action, notes } = req.body;

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ success: false, message: 'Invalid action' });
      }

      const newStatus = action === 'approve' ? 'verified' : 'rejected';
      const approved  = action === 'approve' ? 1 : 0;

      await db.query(
        `UPDATE user_documents
         SET verification_status = ?,
             approved_by_childcare = ?,
             childcare_notes = ?,
             verified_at = NOW()
         WHERE upload_id = ?`,
        [newStatus, approved, notes || null, uploadId]
      );

      // Get doc + application + user info
      const [[doc]] = await db.query(
        `SELECT ud.application_id, ud.file_name,
                aa.user_id, aa.orphanage_id,
                ad.document_name, ad.is_mandatory
         FROM user_documents ud
         JOIN adoption_applications aa ON ud.application_id = aa.application_id
         JOIN adoption_documents ad ON ud.document_id = ad.document_id
         WHERE ud.upload_id = ?`,
        [uploadId]
      );

      if (doc) {
        const [[user]] = await db.query(
          'SELECT email, first_name FROM users WHERE user_id = ?',
          [doc.user_id]
        );

        // In-app notification
        const notifTitle = action === 'approve'
          ? `Document Approved: ${doc.document_name}`
          : `Document Needs Attention: ${doc.document_name}`;
        const notifMsg = action === 'approve'
          ? `Your "${doc.document_name}" has been verified by the Childcare Services Department.`
          : `Your "${doc.document_name}" needs resubmission.${notes ? ' Reason: ' + notes : ''}`;

        await createNotification(doc.user_id, notifTitle, notifMsg,
          action === 'approve' ? 'document_uploaded' : 'adoption_update');

        // Email notification
        if (user?.email) {
          if (action === 'approve') {
            emailService.sendDocumentApprovedEmail?.(
              user.email, user.first_name, doc.document_name, doc.application_id, notes
            ).catch(() => {});
          } else {
            emailService.sendDocumentRejectedEmail?.(
              user.email, user.first_name, doc.document_name, doc.application_id, notes
            ).catch(() => {});
          }
        }

        // ── KEY: check if ALL mandatory docs are now approved ──
        // If so, advance the application to stage 2
        if (action === 'approve') {
          const [mandatoryDocs] = await db.query(
            `SELECT ad.document_id FROM adoption_documents ad WHERE ad.country = 'Sri Lanka' AND ad.is_mandatory = 1`
          );
          const mandatoryIds = mandatoryDocs.map(d => d.document_id);

          const [approvedMandatory] = await db.query(
            `SELECT ud.document_id FROM user_documents ud
             WHERE ud.application_id = ? AND ud.approved_by_childcare = 1
             AND ud.document_id IN (${mandatoryIds.map(() => '?').join(',')})`,
            [doc.application_id, ...mandatoryIds]
          );

          if (approvedMandatory.length >= mandatoryIds.length) {
            // All mandatory docs approved — advance stage 1 → 2
            await db.query(
              `UPDATE adoption_timeline
               SET status = 'completed', actual_completion_date = CURDATE()
               WHERE application_id = ? AND stage_order = 1`,
              [doc.application_id]
            );
            await db.query(
              `UPDATE adoption_timeline SET status = 'in_progress'
               WHERE application_id = ? AND stage_order = 2`,
              [doc.application_id]
            );
            await db.query(
              `UPDATE adoption_applications
               SET application_status = 'documents_submitted',
                   current_stage = 'Initial Application Submission'
               WHERE application_id = ?`,
              [doc.application_id]
            );

            await createNotification(
              doc.user_id,
              'Stage 1 Complete! 🎉',
              'All mandatory documents verified. Your application moves to Initial Application Submission.',
              'stage_completed'
            );

            if (user?.email) {
              emailService.sendStageCompletedEmail?.(
                user.email, user.first_name,
                'Document Preparation', 'Initial Application Submission',
                doc.application_id
              ).catch(() => {});
            }
          }
        }
      }

      res.json({
        success: true,
        message: `Document ${action === 'approve' ? 'approved' : 'rejected'}. User notified.`,
      });
    } catch (err) {
      console.error('reviewDocument error:', err);
      res.status(500).json({ success: false, message: 'Failed to review document' });
    }
  },

  // ── Update timeline stage ─────────────────────────────────
  updateTimelineStage: async (req, res) => {
    try {
      const { timelineId } = req.params;
      const { status, notes } = req.body;

      await db.query(
        `UPDATE adoption_timeline
         SET status = ?, notes = ?,
             actual_completion_date = CASE WHEN ? = 'completed' THEN CURDATE() ELSE actual_completion_date END
         WHERE timeline_id = ?`,
        [status, notes, status, timelineId]
      );

      if (status === 'completed') {
        const [[cur]] = await db.query(
          'SELECT application_id, stage_order, stage_name FROM adoption_timeline WHERE timeline_id = ?',
          [timelineId]
        );
        if (cur) {
          await db.query(
            `UPDATE adoption_timeline SET status = 'in_progress'
             WHERE application_id = ? AND stage_order = ?`,
            [cur.application_id, cur.stage_order + 1]
          );

          const [[next]] = await db.query(
            'SELECT stage_name FROM adoption_timeline WHERE application_id = ? AND stage_order = ?',
            [cur.application_id, cur.stage_order + 1]
          );

          const [[app]] = await db.query(
            'SELECT user_id FROM adoption_applications WHERE application_id = ?',
            [cur.application_id]
          );

          if (app) {
            await createNotification(
              app.user_id,
              `Stage Completed: ${cur.stage_name}`,
              next ? `Next: ${next.stage_name}` : 'Congratulations on your progress!',
              'stage_completed'
            );
          }
        }
      }

      res.json({ success: true, message: 'Stage updated' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to update stage' });
    }
  },
};

module.exports = adoptionController;
