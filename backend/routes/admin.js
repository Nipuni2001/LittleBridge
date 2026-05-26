const express = require('express');
const router  = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

// Middleware: require admin or childcare role
const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success:false, message:'Auth required' });
  if (!['admin','childcare_services','super_admin'].includes(req.user.userType)) {
    return res.status(403).json({ success:false, message:'Admin access required' });
  }
  next();
};

// GET /api/admin/users — all users (non-guest)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, email, first_name, last_name, user_type, status, created_at, city
       FROM users WHERE is_guest = 0
       ORDER BY created_at DESC`
    );
    res.json({ success:true, count:rows.length, data:rows });
  } catch (err) {
    res.status(500).json({ success:false, message:'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/suspend
router.put('/users/:id/suspend', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.query('UPDATE users SET status = ? WHERE user_id = ?', ['suspended', req.params.id]);
    res.json({ success:true });
  } catch { res.status(500).json({ success:false, message:'Failed' }); }
});

// PUT /api/admin/users/:id/activate
router.put('/users/:id/activate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.query('UPDATE users SET status = ? WHERE user_id = ?', ['active', req.params.id]);
    res.json({ success:true });
  } catch { res.status(500).json({ success:false, message:'Failed' }); }
});

// GET /api/admin/applications — all adoption applications with user + orphanage info
router.get('/applications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT aa.*,
              u.first_name, u.last_name, u.email AS user_email,
              o.name AS orphanage_name,
              (SELECT COUNT(*) FROM adoption_timeline at2
               WHERE at2.application_id = aa.application_id AND at2.status='completed') AS completed_stages,
              (SELECT COUNT(*) FROM adoption_timeline at2
               WHERE at2.application_id = aa.application_id) AS total_stages
       FROM adoption_applications aa
       JOIN users u ON aa.user_id = u.user_id
       JOIN orphanages o ON aa.orphanage_id = o.orphanage_id
       ORDER BY aa.initiated_date DESC`
    );
    res.json({ success:true, count:rows.length, data:rows });
  } catch (err) {
    res.status(500).json({ success:false, message:'Failed to fetch applications' });
  }
});

// GET /api/admin/stats/users
router.get('/stats/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [[r]] = await db.query('SELECT COUNT(*) AS count FROM users WHERE is_guest=0');
    res.json({ success:true, count:r.count });
  } catch { res.json({ success:true, count:0 }); }
});

// GET /api/admin/stats/applications
router.get('/stats/applications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [[r]] = await db.query('SELECT COUNT(*) AS count FROM adoption_applications');
    res.json({ success:true, count:r.count });
  } catch { res.json({ success:true, count:0 }); }
});

// GET /api/admin/stats/donations
router.get('/stats/donations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [[r]] = await db.query('SELECT COUNT(*) AS count FROM sponsorships');
    res.json({ success:true, count:r.count });
  } catch { res.json({ success:true, count:0 }); }
});

module.exports = router;
