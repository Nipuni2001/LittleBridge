const db = require('../config/database');

const notificationController = {

  // GET /api/notifications — user's notifications
  getNotifications: async (req, res) => {
    try {
      const userId = req.user.userId;
      const [rows] = await db.query(
        `SELECT notification_id, title, message, notification_type,
                is_read, created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT 50`,
        [userId]
      );
      res.json({ success: true, data: rows });
    } catch (err) {
      console.error('getNotifications error:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  },

  // PUT /api/notifications/:id/read
  markRead: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      await db.query(
        'UPDATE notifications SET is_read = true WHERE notification_id = ? AND user_id = ?',
        [id, userId]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to mark notification' });
    }
  },

  // PUT /api/notifications/mark-all-read
  markAllRead: async (req, res) => {
    try {
      const userId = req.user.userId;
      await db.query(
        'UPDATE notifications SET is_read = true WHERE user_id = ?',
        [userId]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to mark all notifications' });
    }
  },

  // Internal helper — create a notification record
  createNotification: async (userId, title, message, type = 'default') => {
    try {
      await db.query(
        `INSERT INTO notifications (user_id, title, message, notification_type)
         VALUES (?, ?, ?, ?)`,
        [userId, title, message, type]
      );
    } catch (err) {
      console.error('createNotification error:', err.message);
    }
  },
};

module.exports = notificationController;
