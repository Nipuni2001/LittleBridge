const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const emailService = require('../services/emailService');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

async function notify(userId, title, message, type = 'default') {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, notification_type)
       VALUES (?, ?, ?, ?)`,
      [userId, title, message, type]
    );
  } catch {}
}

// ── GET /sponsorships — list all (admin) ────────────────────
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, o.name AS orphanage_name,
              u.first_name, u.last_name, u.email AS donor_email
       FROM sponsorships s
       JOIN orphanages o ON s.orphanage_id = o.orphanage_id
       LEFT JOIN users u ON s.user_id = u.user_id
       ORDER BY s.created_at DESC
       LIMIT 200`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch sponsorships' });
  }
});

// ── GET /sponsorships/my-sponsorships — user's donation history ─
// (Frontend Dashboard.jsx calls this path)
router.get('/my-sponsorships', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, o.name AS orphanage_name, o.city AS orphanage_city
       FROM sponsorships s
       JOIN orphanages o ON s.orphanage_id = o.orphanage_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.user.userId]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
});

// ── GET /sponsorships/my-donations — alias ──────────────────
router.get('/my-donations', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.*, o.name AS orphanage_name, o.city AS orphanage_city
       FROM sponsorships s
       JOIN orphanages o ON s.orphanage_id = o.orphanage_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [req.user.userId]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
});

// ── GET /sponsorships/orphanage/:orphanageId/requests ───────
router.get('/orphanage/:orphanageId/requests', authenticateToken, async (req, res) => {
  try {
    const { orphanageId } = req.params;
    const [rows] = await db.query(
      `SELECT s.*,
              CASE WHEN s.is_anonymous = 1 THEN 'Anonymous Donor'
                   ELSE CONCAT(COALESCE(u.first_name,''), ' ', COALESCE(u.last_name,'')) END AS donor_name,
              u.email AS donor_email
       FROM sponsorships s
       LEFT JOIN users u ON s.user_id = u.user_id
       WHERE s.orphanage_id = ?
       ORDER BY s.created_at DESC`,
      [orphanageId]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('fetchRequests error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sponsorship requests' });
  }
});

// ── POST /sponsorships — create donation ────────────────────
// FIX: status = 'pledged' (was 'pending' which is not in the enum)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      orphanageId, donationType, amount, category,
      itemDescription, scheduledDate, isAnonymous = false
    } = req.body;

    const userId = req.user?.userId || null;

    const [result] = await db.query(
      `INSERT INTO sponsorships
        (orphanage_id, user_id, donation_type, amount, category,
         item_description, scheduled_date, is_anonymous, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pledged')`,
      [orphanageId, userId, donationType || 'goods', amount || null,
       category, itemDescription, scheduledDate || null, isAnonymous ? 1 : 0]
    );

    // Fetch donor and orphanage info for notifications/emails
    const [[donor]] = userId
      ? await db.query('SELECT email, first_name, last_name FROM users WHERE user_id = ?', [userId])
      : [[null]];

    const [[orph]] = await db.query(
      'SELECT name, email FROM orphanages WHERE orphanage_id = ?', [orphanageId]
    );

    // In-app notification to donor (if logged in)
    if (userId && !isAnonymous) {
      await notify(
        userId,
        'Donation Request Submitted',
        `Your ${category} donation request to ${orph?.name || 'the orphanage'} has been submitted and awaits confirmation.`,
        'sponsorship_confirmation'
      );
    }

    // Email to donor (if logged in, non-fatal)
    if (donor?.email) {
      emailService.sendSponsorshipReceivedEmail(
        donor.email,
        donor.first_name,
        orph?.name || 'the orphanage',
        category,
        amount,
        scheduledDate
      ).catch(err => console.warn('Donor email not sent:', err.message));
    }

    // Email to orphanage (non-fatal)
    if (orph?.email) {
      const donorName = isAnonymous ? null : (donor ? `${donor.first_name} ${donor.last_name}`.trim() : null);
      emailService.sendNewDonationToOrphanageEmail(
        orph.email,
        orph.name,
        donorName,
        Boolean(isAnonymous),
        category,
        amount,
        itemDescription,
        scheduledDate
      ).catch(err => console.warn('Orphanage email not sent:', err.message));
    }

    // In-app notification to orphanage user accounts
    const [orphUsers] = await db.query(
      `SELECT u.user_id FROM users u
       JOIN orphanages o ON u.user_id = o.user_id
       WHERE o.orphanage_id = ?`,
      [orphanageId]
    );
    for (const ou of orphUsers) {
      await notify(
        ou.user_id,
        'New Sponsorship Request',
        `A ${donationType === 'monetary' ? `LKR ${amount} monetary` : (category || 'goods')} donation request has been received. Please review and confirm.`,
        'sponsorship_request'
      );
    }

    res.status(201).json({
      success: true,
      message: 'Donation request submitted',
      sponsorshipId: result.insertId,
    });
  } catch (err) {
    console.error('createSponsorship error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit donation' });
  }
});

// ── PUT /sponsorships/:id/confirm ───────────────────────────
router.put('/:id/confirm', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [[spon]] = await db.query(
      `SELECT s.*, o.user_id AS orphanage_user_id, o.name AS orphanage_name,
              u.first_name AS donor_first, u.last_name AS donor_last,
              u.email AS donor_email, u.user_id AS donor_user_id
       FROM sponsorships s
       JOIN orphanages o ON s.orphanage_id = o.orphanage_id
       LEFT JOIN users u ON s.user_id = u.user_id
       WHERE s.sponsorship_id = ?`,
      [id]
    );

    if (!spon) {
      return res.status(404).json({ success: false, message: 'Sponsorship request not found' });
    }

    await db.query(
      `UPDATE sponsorships SET status = 'confirmed', orphanage_confirmed = 1,
       orphanage_confirmed_at = NOW() WHERE sponsorship_id = ?`,
      [id]
    );

    // In-app notification to donor
    if (spon.donor_user_id) {
      await notify(
        spon.donor_user_id,
        'Donation Confirmed! 🎉',
        `Your donation to ${spon.orphanage_name} has been confirmed. Thank you for your generosity!`,
        'default'
      );
    }

    // Email to donor (non-fatal)
    if (spon.donor_email && !spon.is_anonymous) {
      emailService.sendDonationConfirmedEmail(
        spon.donor_email,
        spon.donor_first,
        spon.orphanage_name,
        spon.category
      ).catch(err => console.warn('Confirm email not sent:', err.message));
    }

    res.json({ success: true, message: 'Donation request confirmed' });
  } catch (err) {
    console.error('confirmSponsorship error:', err);
    res.status(500).json({ success: false, message: 'Failed to confirm donation' });
  }
});

// ── PUT /sponsorships/:id/decline ───────────────────────────
// FIX: status = 'cancelled' (was 'declined' which is not in the enum)
router.put('/:id/decline', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const [[spon]] = await db.query(
      `SELECT s.*, u.user_id AS donor_user_id, u.email AS donor_email,
              u.first_name AS donor_first, o.name AS orphanage_name
       FROM sponsorships s
       LEFT JOIN users u ON s.user_id = u.user_id
       JOIN orphanages o ON s.orphanage_id = o.orphanage_id
       WHERE s.sponsorship_id = ?`,
      [id]
    );

    if (!spon) {
      return res.status(404).json({ success: false, message: 'Sponsorship request not found' });
    }

    // 'cancelled' is the correct enum value (no 'declined' in schema)
    await db.query(
      `UPDATE sponsorships SET status = 'cancelled' WHERE sponsorship_id = ?`,
      [id]
    );

    if (spon.donor_user_id) {
      await notify(
        spon.donor_user_id,
        'Donation Update',
        reason
          ? `The orphanage was unable to accept your donation at this time. Reason: ${reason}`
          : 'The orphanage was unable to accept your donation at this time.',
        'default'
      );
    }

    res.json({ success: true, message: 'Donation request declined' });
  } catch (err) {
    console.error('declineSponsorship error:', err);
    res.status(500).json({ success: false, message: 'Failed to decline donation' });
  }
});

module.exports = router;