const db = require('../config/database');

const sponsorshipController = {
  // Create new sponsorship/donation
  createSponsorship: async (req, res) => {
    try {
      const {
        orphanageId,
        donationType,
        amount,
        category,
        itemDescription,
        scheduledDate,
        isAnonymous
      } = req.body;

      const userId = req.user ? req.user.userId : null;

      // Validate orphanage exists
      const [orphanages] = await db.query(
        'SELECT orphanage_id FROM orphanages WHERE orphanage_id = ? AND status = "approved"',
        [orphanageId]
      );

      if (orphanages.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Orphanage not found'
        });
      }

      // Create sponsorship
      const [result] = await db.query(
        `INSERT INTO sponsorships 
        (user_id, orphanage_id, donation_type, amount, category, item_description, 
         scheduled_date, is_anonymous, status, payment_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pledged', 'pending')`,
        [userId, orphanageId, donationType, amount || null, category, itemDescription, 
         scheduledDate, isAnonymous || false]
      );

      // Update orphanage sponsorship stats
      await db.query(
        `INSERT INTO orphanage_sponsorship_stats (orphanage_id, total_sponsorships, last_sponsorship_date, sponsorships_last_30_days)
         VALUES (?, 1, CURDATE(), 1)
         ON DUPLICATE KEY UPDATE 
         total_sponsorships = total_sponsorships + 1,
         last_sponsorship_date = CURDATE(),
         sponsorships_last_30_days = sponsorships_last_30_days + 1`,
        [orphanageId]
      );

      // Create notification if user is logged in
      if (userId) {
        await db.query(
          `INSERT INTO notifications (user_id, title, message, notification_type)
           VALUES (?, ?, ?, 'sponsorship_confirmation')`,
          [
            userId,
            'Sponsorship Confirmed',
            `Thank you for your generous donation to the orphanage!`
          ]
        );
      }

      // Log activity
      if (userId) {
        await db.query(
          'INSERT INTO activity_logs (user_id, action_type, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)',
          [userId, 'SPONSORSHIP_CREATED', 'sponsorship', result.insertId, 'User created sponsorship']
        );
      }

      res.status(201).json({
        success: true,
        message: 'Sponsorship created successfully',
        sponsorshipId: result.insertId
      });
    } catch (error) {
      console.error('Create sponsorship error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create sponsorship'
      });
    }
  },

  // Get user's sponsorships
  getMySponsorships: async (req, res) => {
    try {
      const userId = req.user.userId;

      const [sponsorships] = await db.query(
        `SELECT 
          s.*,
          o.name as orphanage_name,
          o.city as orphanage_city,
          o.phone as orphanage_phone
        FROM sponsorships s
        JOIN orphanages o ON s.orphanage_id = o.orphanage_id
        WHERE s.user_id = ?
        ORDER BY s.created_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        count: sponsorships.length,
        data: sponsorships
      });
    } catch (error) {
      console.error('Get sponsorships error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sponsorships'
      });
    }
  },

  // Get orphanage donation needs
  getDonationNeeds: async (req, res) => {
    try {
      const { orphanageId } = req.params;

      const [needs] = await db.query(
        `SELECT * FROM donation_needs 
         WHERE orphanage_id = ? AND status = 'active'
         ORDER BY 
           CASE priority
             WHEN 'urgent' THEN 1
             WHEN 'high' THEN 2
             WHEN 'medium' THEN 3
             WHEN 'low' THEN 4
           END,
           created_at DESC`,
        [orphanageId]
      );

      res.json({
        success: true,
        count: needs.length,
        data: needs
      });
    } catch (error) {
      console.error('Get donation needs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch donation needs'
      });
    }
  },

  // Get upcoming donation events for an orphanage
  getUpcomingDonations: async (req, res) => {
    try {
      const { orphanageId } = req.params;

      const [donations] = await db.query(
        `SELECT 
          scheduled_date,
          category,
          item_description,
          COUNT(*) as donor_count,
          SUM(CASE WHEN amount IS NOT NULL THEN amount ELSE 0 END) as total_amount,
          status
        FROM sponsorships
        WHERE orphanage_id = ? 
        AND scheduled_date >= CURDATE()
        AND status IN ('pledged', 'confirmed')
        GROUP BY scheduled_date, category
        ORDER BY scheduled_date ASC`,
        [orphanageId]
      );

      res.json({
        success: true,
        count: donations.length,
        data: donations
      });
    } catch (error) {
      console.error('Get upcoming donations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming donations'
      });
    }
  },

  // Update sponsorship status
  updateSponsorshipStatus: async (req, res) => {
    try {
      const { sponsorshipId } = req.params;
      const { status, paymentStatus, deliveryDate } = req.body;
      const userId = req.user.userId;

      // Verify sponsorship belongs to user
      const [sponsorships] = await db.query(
        'SELECT user_id, orphanage_id FROM sponsorships WHERE sponsorship_id = ?',
        [sponsorshipId]
      );

      if (sponsorships.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sponsorship not found'
        });
      }

      if (sponsorships[0].user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      // Update sponsorship
      let query = 'UPDATE sponsorships SET ';
      const params = [];

      if (status) {
        query += 'status = ?, ';
        params.push(status);
      }

      if (paymentStatus) {
        query += 'payment_status = ?, ';
        params.push(paymentStatus);
      }

      if (deliveryDate) {
        query += 'delivery_date = ?, ';
        params.push(deliveryDate);
      }

      query = query.slice(0, -2); // Remove trailing comma
      query += ' WHERE sponsorship_id = ?';
      params.push(sponsorshipId);

      await db.query(query, params);

      res.json({
        success: true,
        message: 'Sponsorship updated successfully'
      });
    } catch (error) {
      console.error('Update sponsorship error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update sponsorship'
      });
    }
  },

  // Get sponsorship statistics (for dashboard)
  getSponsorshipStats: async (req, res) => {
    try {
      const userId = req.user.userId;

      // Total sponsorships
      const [totalCount] = await db.query(
        'SELECT COUNT(*) as total FROM sponsorships WHERE user_id = ?',
        [userId]
      );

      // Total amount donated
      const [totalAmount] = await db.query(
        'SELECT SUM(amount) as total FROM sponsorships WHERE user_id = ? AND amount IS NOT NULL',
        [userId]
      );

      // Sponsorships by category
      const [byCategory] = await db.query(
        `SELECT category, COUNT(*) as count 
         FROM sponsorships 
         WHERE user_id = ?
         GROUP BY category`,
        [userId]
      );

      // Recent sponsorships
      const [recent] = await db.query(
        `SELECT s.*, o.name as orphanage_name
         FROM sponsorships s
         JOIN orphanages o ON s.orphanage_id = o.orphanage_id
         WHERE s.user_id = ?
         ORDER BY s.created_at DESC
         LIMIT 5`,
        [userId]
      );

      res.json({
        success: true,
        stats: {
          totalSponsorships: totalCount[0].total,
          totalAmountDonated: totalAmount[0].total || 0,
          byCategory,
          recentSponsorships: recent
        }
      });
    } catch (error) {
      console.error('Get sponsorship stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  },

  // Batch cleanup job to update sponsorship stats (meka cron job ekak run wenna ona. 30-day and 90-day counts update karanna one)
  updateSponsorshipStatsJob: async (req, res) => {
    try {
      // Update 30-day counts
      await db.query(`
        UPDATE orphanage_sponsorship_stats oss
        SET sponsorships_last_30_days = (
          SELECT COUNT(*) 
          FROM sponsorships s 
          WHERE s.orphanage_id = oss.orphanage_id 
          AND s.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        )
      `);

      // Update 90-day counts
      await db.query(`
        UPDATE orphanage_sponsorship_stats oss
        SET sponsorships_last_90_days = (
          SELECT COUNT(*) 
          FROM sponsorships s 
          WHERE s.orphanage_id = oss.orphanage_id 
          AND s.created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
        )
      `);

      res.json({
        success: true,
        message: 'Sponsorship stats updated successfully'
      });
    } catch (error) {
      console.error('Update stats job error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update stats'
      });
    }
  }
};

module.exports = sponsorshipController;