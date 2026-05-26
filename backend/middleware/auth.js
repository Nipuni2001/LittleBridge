const jwt = require('jsonwebtoken');
const db  = require('../config/database');

const SECRET = () => process.env.JWT_SECRET || 'lb_default_secret_change_me';

const authenticateToken = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    const token  = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET());
    } catch (e) {
      const msg = e.name === 'TokenExpiredError'
        ? 'Session expired. Please login again.'
        : 'Invalid token';
      return res.status(401).json({ success: false, message: msg });
    }

    // ── Case 1: Regular user token (userId present) ───────────
    if (decoded.userId) {
      const [rows] = await db.query(
        `SELECT user_id, email, user_type, status
         FROM users WHERE user_id = ? AND status = 'active'`,
        [decoded.userId]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found or inactive' });
      }

      req.user = {
        userId:   decoded.userId,
        email:    decoded.email,
        userType: decoded.userType,
        isGuest:  decoded.isGuest || false,
        isAdmin:  false,
      };
      return next();
    }

    // ── Case 2: Admin/staff token (adminId present) ───────────
    if (decoded.adminId) {
      const [rows] = await db.query(
        `SELECT admin_id, username, role, is_active
         FROM admin_users WHERE admin_id = ? AND is_active = 1`,
        [decoded.adminId]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Admin account not found or inactive' });
      }

      req.user = {
        userId:   decoded.adminId,   // adminId used as userId for admin tokens
        email:    decoded.username,
        userType: decoded.role,      // 'admin' | 'super_admin' | 'childcare_services'
        isGuest:  false,
        isAdmin:  true,
      };
      return next();
    }

    return res.status(403).json({ success: false, message: 'Invalid token type' });

  } catch (err) {
    console.error('authenticateToken error:', err.message);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

// Admin-table token required (admin_users table only — for dedicated admin routes)
const authenticateAdmin = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    const token  = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET());
    } catch {
      return res.status(403).json({ success: false, message: 'Invalid admin token' });
    }

    if (!decoded.adminId) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.admin = { adminId: decoded.adminId, username: decoded.username, role: decoded.role };
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Admin authentication error' });
  }
};

// Optional — passes through even without a token
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    const token  = header?.startsWith('Bearer ') ? header.slice(7) : null;

    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET());
        if (decoded.userId) {
          req.user = {
            userId:   decoded.userId,
            email:    decoded.email,
            userType: decoded.userType,
            isGuest:  decoded.isGuest || false,
            isAdmin:  false,
          };
        } else if (decoded.adminId) {
          req.user = {
            userId:   decoded.adminId,
            email:    decoded.username,
            userType: decoded.role,
            isGuest:  false,
            isAdmin:  true,
          };
        } else {
          req.user = null;
        }
      } catch {
        req.user = null;
      }
    } else {
      req.user = null;
    }
    next();
  } catch {
    req.user = null;
    next();
  }
};

module.exports = { authenticateToken, authenticateAdmin, optionalAuth };