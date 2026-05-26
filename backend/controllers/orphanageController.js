const db           = require('../config/database');
const emailService = require('../services/emailService');

async function createNotification(userId, title, message, type = 'default') {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, message, notification_type)
       VALUES (?, ?, ?, ?)`,
      [userId, title, message, type]
    );
  } catch (err) {
    console.warn('notify warning:', err.message);
  }
}

function parseGoogleMapsUrl(url) {
  if (!url || typeof url !== 'string') return null;
  let m = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };
  m = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };
  m = url.match(/query=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };
  m = url.match(/(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
  if (m) return { latitude: parseFloat(m[1]), longitude: parseFloat(m[2]) };
  return null;
}

const orphanageController = {

  getMyOrphanage: async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT o.*, oss.total_sponsorships, oss.sponsorships_last_30_days
         FROM orphanages o
         LEFT JOIN orphanage_sponsorship_stats oss ON o.orphanage_id = oss.orphanage_id
         WHERE o.user_id = ? LIMIT 1`,
        [req.user.userId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No orphanage found for this account' });
      }
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch orphanage' });
    }
  },

  registerOrphanage: async (req, res) => {
    try {
      const {
        name, registrationNumber, email, phone,
        address, city, state, country = 'Sri Lanka',
        googleMapsUrl, latitude: rawLat, longitude: rawLng,
        capacity, description, website,
      } = req.body;

      const userId = req.user.userId;

      let latitude  = rawLat ? parseFloat(rawLat) : null;
      let longitude = rawLng ? parseFloat(rawLng) : null;
      if (googleMapsUrl && (!latitude || !longitude)) {
        const parsed = parseGoogleMapsUrl(googleMapsUrl);
        if (parsed) { latitude = parsed.latitude; longitude = parsed.longitude; }
      }

      const [existing] = await db.query(
        'SELECT orphanage_id FROM orphanages WHERE user_id = ?', [userId]
      );
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'You already have an orphanage registered', orphanageId: existing[0].orphanage_id });
      }

      const [result] = await db.query(
        `INSERT INTO orphanages
          (user_id, name, registration_number, email, phone, address,
           city, state, country, latitude, longitude, capacity,
           description, website, status, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
        [userId, name, registrationNumber, email, phone, address,
         city, state, country, latitude, longitude, capacity, description, website]
      );

      const orphanageId = result.insertId;

      if (email) emailService.sendOrphanageRegistrationEmail?.(email, name).catch(() => {});
      emailService.sendAdminNewOrphanageAlert?.(name, city, email).catch(() => {});

      // Notify childcare services users in the users table
      const [childcareUsers] = await db.query(
        `SELECT user_id FROM users WHERE user_type = 'childcare_services' AND status = 'active'`
      ).catch(() => [[]]);
      for (const cu of childcareUsers) {
        await createNotification(cu.user_id,
          'New Orphanage Pending Approval',
          `${name} in ${city} has submitted a registration and requires review.`,
          'orphanage_approved'
        );
      }

      res.status(201).json({ success: true, message: 'Registration submitted. Pending approval.', orphanageId });
    } catch (err) {
      console.error('registerOrphanage error:', err);
      res.status(500).json({ success: false, message: 'Failed to submit registration' });
    }
  },

  parseMapUrl: async (req, res) => {
    try {
      const { url } = req.body;
      const coords = parseGoogleMapsUrl(url);
      if (!coords) {
        return res.status(400).json({ success: false, message: 'Could not extract coordinates. Please paste a full Google Maps link.' });
      }
      res.json({ success: true, ...coords });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to parse URL' });
    }
  },

  getPendingOrphanages: async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT o.*, u.first_name, u.last_name, u.email AS owner_email
         FROM orphanages o
         LEFT JOIN users u ON o.user_id = u.user_id
         WHERE o.status = 'pending'
         ORDER BY o.submitted_at DESC`
      );
      res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch pending orphanages' });
    }
  },

  approveOrphanage: async (req, res) => {
    try {
      const { id } = req.params;
      const [[orp]] = await db.query(
        'SELECT name, email, user_id FROM orphanages WHERE orphanage_id = ?', [id]
      );
      if (!orp) return res.status(404).json({ success: false, message: 'Orphanage not found' });

      await db.query(
        `UPDATE orphanages SET status = 'approved', verified_at = NOW() WHERE orphanage_id = ?`, [id]
      );
      await db.query(
        'INSERT IGNORE INTO orphanage_sponsorship_stats (orphanage_id) VALUES (?)', [id]
      ).catch(() => {});

      if (orp.email) emailService.sendOrphanageApprovedEmail?.(orp.email, orp.name).catch(() => {});
      if (orp.user_id) {
        await createNotification(orp.user_id,
          'Orphanage Approved ✓',
          `${orp.name} is now live on LittleBridge. Sponsors and families can find you.`,
          'orphanage_approved'
        );
      }
      res.json({ success: true, message: `${orp.name} approved` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to approve' });
    }
  },

  rejectOrphanage: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const [[orp]] = await db.query('SELECT name, email, user_id FROM orphanages WHERE orphanage_id = ?', [id]);
      if (!orp) return res.status(404).json({ success: false, message: 'Not found' });

      await db.query(`UPDATE orphanages SET status = 'rejected', rejection_reason = ? WHERE orphanage_id = ?`, [reason || null, id]);
      if (orp.email) emailService.sendOrphanageRejectedEmail?.(orp.email, orp.name, reason).catch(() => {});
      if (orp.user_id) await createNotification(orp.user_id, 'Registration Update', `${reason || 'Your registration needs more information.'}`, 'default');
      res.json({ success: true, message: 'Rejected' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to reject' });
    }
  },

  getNearbyOrphanages: async (req, res) => {
    try {
      const { latitude, longitude, radius = 200, purpose } = req.query;
      if (!latitude || !longitude) return res.status(400).json({ success: false, message: 'Location required' });

      const [orphanages] = await db.query(
        `SELECT o.*,
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance,
                oss.total_sponsorships, oss.sponsorships_last_30_days
         FROM orphanages o
         LEFT JOIN orphanage_sponsorship_stats oss ON o.orphanage_id = oss.orphanage_id
         WHERE o.status = 'approved' AND o.latitude IS NOT NULL AND o.longitude IS NOT NULL
         HAVING distance < ?
         ORDER BY ${purpose === 'sponsorship' ? 'COALESCE(oss.sponsorships_last_30_days,0) ASC, distance ASC' : 'distance ASC'}
         LIMIT 50`,
        [parseFloat(latitude), parseFloat(longitude), parseFloat(latitude), parseFloat(radius)]
      );

      if (purpose === 'sponsorship') {
        for (const o of orphanages) {
          const [needs] = await db.query(
            `SELECT category, item_name, description, quantity_needed, priority FROM donation_needs
             WHERE orphanage_id = ? AND status = 'active'
             ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END LIMIT 5`,
            [o.orphanage_id]
          );
          o.donation_needs = needs;
          const [upcoming] = await db.query(
            `SELECT scheduled_date, category, item_description FROM sponsorships
             WHERE orphanage_id = ? AND scheduled_date >= CURDATE() AND status IN ('pledged','confirmed')
             ORDER BY scheduled_date ASC LIMIT 3`,
            [o.orphanage_id]
          );
          o.upcoming_donations = upcoming;
        }
      }

      res.json({ success: true, count: orphanages.length, data: orphanages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch orphanages' });
    }
  },

  getOrphanageById: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await db.query(
        `SELECT o.*, oss.total_sponsorships FROM orphanages o
         LEFT JOIN orphanage_sponsorship_stats oss ON o.orphanage_id = oss.orphanage_id
         WHERE o.orphanage_id = ? AND o.status = 'approved'`, [id]
      );
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
      const [needs] = await db.query(
        `SELECT * FROM donation_needs WHERE orphanage_id = ? AND status = 'active'
         ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 ELSE 3 END`, [id]
      );
      res.json({ success: true, data: { ...rows[0], donation_needs: needs } });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch' });
    }
  },

  searchOrphanages: async (req, res) => {
    try {
      const { query, city } = req.query;
      let sql = `SELECT o.* FROM orphanages o WHERE o.status = 'approved'`;
      const params = [];
      if (query) { sql += ' AND (o.name LIKE ? OR o.description LIKE ?)'; params.push(`%${query}%`, `%${query}%`); }
      if (city)  { sql += ' AND o.city = ?'; params.push(city); }
      sql += ' ORDER BY o.name ASC LIMIT 50';
      const [rows] = await db.query(sql, params);
      res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Search failed' });
    }
  },

  createOrphanage: async (req, res) => {
    try {
      const { name, registrationNumber, email, phone, address, city, state,
              country = 'Sri Lanka', googleMapsUrl, latitude: rawLat, longitude: rawLng,
              capacity, description, website } = req.body;
      let latitude  = rawLat ? parseFloat(rawLat) : null;
      let longitude = rawLng ? parseFloat(rawLng) : null;
      if (googleMapsUrl && (!latitude || !longitude)) {
        const p = parseGoogleMapsUrl(googleMapsUrl);
        if (p) { latitude = p.latitude; longitude = p.longitude; }
      }
      const [result] = await db.query(
        `INSERT INTO orphanages (name, registration_number, email, phone, address, city, state,
          country, latitude, longitude, capacity, description, website, status, verified_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', NOW())`,
        [name, registrationNumber, email, phone, address, city, state,
         country, latitude, longitude, capacity, description, website]
      );
      await db.query('INSERT IGNORE INTO orphanage_sponsorship_stats (orphanage_id) VALUES (?)', [result.insertId]).catch(() => {});
      res.status(201).json({ success: true, message: 'Orphanage created', orphanageId: result.insertId });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to create' });
    }
  },

  // ── DONATION NEEDS CRUD ───────────────────────────────────────

  /**
   * GET /orphanages/:orphanageId/needs
   * Returns all active donation needs for an orphanage (dynamically from DB)
   */
  getDonationNeeds: async (req, res) => {
    try {
      const { orphanageId } = req.params;
      const [rows] = await db.query(
        `SELECT * FROM donation_needs WHERE orphanage_id = ? AND status = 'active'
         ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END`,
        [orphanageId]
      );
      res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      console.error('getDonationNeeds error:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch needs' });
    }
  },

  /**
   * POST /orphanages/:orphanageId/needs
   * FIXED: now uses snake_case field names matching what the frontend sends.
   * Old code: { itemName, quantityNeeded } ← undefined → SQL error
   * New code: { item_name, quantity_needed } ← matches frontend newNeed object
   */
  addDonationNeed: async (req, res) => {
    try {
      const { orphanageId } = req.params;
      // Accept both camelCase (old) and snake_case (new frontend) field names
      const {
        category,
        item_name,   itemName,
        description,
        quantity_needed, quantityNeeded,
        priority = 'medium',
      } = req.body;

      const finalItemName = item_name || itemName || null;
      const finalQty      = quantity_needed || quantityNeeded || null;

      if (!finalItemName) {
        return res.status(400).json({ success: false, message: 'Item name is required' });
      }

      const [result] = await db.query(
        `INSERT INTO donation_needs
          (orphanage_id, category, item_name, description, quantity_needed, priority, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [orphanageId, category || 'other', finalItemName, description || null, finalQty, priority]
      );

      const [rows] = await db.query('SELECT * FROM donation_needs WHERE need_id = ?', [result.insertId]);
      res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
      console.error('addDonationNeed error:', err);
      res.status(500).json({ success: false, message: 'Failed to add need' });
    }
  },

  /**
   * PUT /orphanages/:orphanageId/needs/:needId
   * Update a donation need inline
   */
  updateDonationNeed: async (req, res) => {
    try {
      const { orphanageId, needId } = req.params;
      const { category, item_name, itemName, description, quantity_needed, quantityNeeded, priority } = req.body;

      const finalItemName = item_name || itemName;
      const finalQty      = quantity_needed || quantityNeeded;

      await db.query(
        `UPDATE donation_needs
         SET category = COALESCE(?, category),
             item_name = COALESCE(?, item_name),
             description = COALESCE(?, description),
             quantity_needed = COALESCE(?, quantity_needed),
             priority = COALESCE(?, priority)
         WHERE need_id = ? AND orphanage_id = ?`,
        [category || null, finalItemName || null, description || null,
         finalQty || null, priority || null, needId, orphanageId]
      );

      const [rows] = await db.query('SELECT * FROM donation_needs WHERE need_id = ?', [needId]);
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      console.error('updateDonationNeed error:', err);
      res.status(500).json({ success: false, message: 'Failed to update need' });
    }
  },

  /**
   * DELETE /orphanages/:orphanageId/needs/:needId
   * Soft-delete a donation need (sets status = 'fulfilled')
   */
  deleteDonationNeed: async (req, res) => {
    try {
      const { orphanageId, needId } = req.params;
      await db.query(
        `UPDATE donation_needs SET status = 'fulfilled' WHERE need_id = ? AND orphanage_id = ?`,
        [needId, orphanageId]
      );
      res.json({ success: true, message: 'Need removed' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to remove need' });
    }
  },

  getAvailableSlots: async (req, res) => {
    try {
      const { orphanageId } = req.params;
      const { date } = req.query;
      const [booked] = await db.query(
        `SELECT appointment_date FROM appointments
         WHERE orphanage_id = ? AND DATE(appointment_date) = ? AND status IN ('scheduled','confirmed')`,
        [orphanageId, date]
      );
      const bookedHours = new Set(booked.map(a => new Date(a.appointment_date).getHours()));
      const slots = [];
      for (let h = 9; h < 17; h++) {
        if (!bookedHours.has(h)) {
          slots.push({ time: `${String(h).padStart(2,'0')}:00`, datetime: `${date} ${String(h).padStart(2,'0')}:00:00` });
        }
      }
      res.json({ success: true, date, availableSlots: slots });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch slots' });
    }
  },
};

module.exports = orphanageController;
