const db     = require('../config/database');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const hashPw    = p    => bcrypt.hash(p, 12);
const comparePw = (p,h) => bcrypt.compare(p, h);
const genRand   = (n=16) => crypto.randomBytes(n).toString('hex');

const makeToken = (payload, exp = process.env.JWT_EXPIRE || '7d') =>
  jwt.sign(payload, process.env.JWT_SECRET || 'lb_default_secret_change_me', { expiresIn: exp });

// ── REGISTER ──────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, message: errs.array()[0].msg });
    }

    const {
      email, password, firstName, lastName,
      phone, address, city, state,
      country = 'Sri Lanka',
      userType, adminCode,
    } = req.body;

    const PUBLIC  = ['adopter', 'sponsor', 'both', 'orphanage'];
    const PRIVATE = ['admin', 'childcare_services'];
    const ALL     = [...PUBLIC, ...PRIVATE];

    if (!ALL.includes(userType)) {
      return res.status(400).json({ success: false, message: 'Invalid user type.' });
    }

    if (PRIVATE.includes(userType)) {
      const code = (process.env.ADMIN_REGISTRATION_CODE || 'LB_ADMIN_2026').trim();
      if (!adminCode || adminCode.trim() !== code) {
        return res.status(403).json({
          success: false,
          message: 'Invalid registration code. Contact the LittleBridge administrator.',
        });
      }
    }

    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please login instead.',
      });
    }

    const hash = await hashPw(password);

    const [result] = await db.query(
      `INSERT INTO users
         (email, password_hash, first_name, last_name, phone,
          address, city, state, country, user_type, is_guest, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'active')`,
      [email, hash, firstName, lastName,
       phone || null, address || null, city || null, state || null,
       country, userType]
    );

    const userId = result.insertId;
    const token  = makeToken({ userId, email, userType, isGuest: false });
    const user   = { userId, email, firstName, lastName, userType, isGuest: false };

    // ── Send welcome email (non-admin accounts only, non-fatal) ──
    if (!PRIVATE.includes(userType)) {
      emailService.sendWelcomeEmail(email, firstName, userType).catch(err => {
        console.warn('Welcome email not sent:', err.message);
      });
    }

    db.query(
      `INSERT INTO activity_logs (user_id, action_type, description, ip_address)
       VALUES (?, 'USER_REGISTRATION', ?, ?)`,
      [userId, `New ${userType} registered`, req.ip || '']
    ).catch(() => {});

    return res.status(201).json({ success: true, message: 'Registration successful!', token, user });

  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ success: false, message: errs.array()[0].msg });
    }

    const { email, password } = req.body;

    const [rows] = await db.query(
      `SELECT user_id, email, password_hash, first_name, last_name,
              user_type, is_guest, status
       FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const u = rows[0];

    if (u.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
    }

    const ok = await comparePw(password, u.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    db.query('UPDATE users SET last_login = NOW() WHERE user_id = ?', [u.user_id]).catch(() => {});

    const token = makeToken({
      userId:   u.user_id,
      email:    u.email,
      userType: u.user_type,
      isGuest:  Boolean(u.is_guest),
    });

    const user = {
      userId:    u.user_id,
      email:     u.email,
      firstName: u.first_name,
      lastName:  u.last_name,
      userType:  u.user_type,
      isGuest:   Boolean(u.is_guest),
    };

    db.query(
      `INSERT INTO activity_logs (user_id, action_type, description, ip_address)
       VALUES (?, 'USER_LOGIN', 'User logged in', ?)`,
      [u.user_id, req.ip || '']
    ).catch(() => {});

    return res.json({ success: true, message: 'Login successful', token, user });

  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

// ── GUEST LOGIN ───────────────────────────────────────────────
exports.guestLogin = async (req, res) => {
  try {
    const ts    = Date.now();
    const rand  = Math.random().toString(36).slice(2, 7);
    const email = `guest_${ts}_${rand}@temp.lb`;
    const hash  = await hashPw(genRand());

    const [result] = await db.query(
      `INSERT INTO users
         (email, password_hash, first_name, last_name,
          user_type, is_guest, status)
       VALUES (?, ?, 'Guest', 'User', 'sponsor', 1, 'active')`,
      [email, hash]
    );

    const userId = result.insertId;
    const token  = makeToken(
      { userId, email, userType: 'sponsor', isGuest: true },
      '24h'
    );

    return res.json({
      success: true,
      message: 'Guest session created',
      token,
      user: {
        userId,
        email,
        firstName: 'Guest',
        lastName:  'User',
        userType:  'sponsor',
        isGuest:   true,
      },
    });

  } catch (err) {
    console.error('guestLogin error:', err);
    res.status(500).json({ success: false, message: 'Failed to create guest session. Please try again.' });
  }
};

// ── GET PROFILE ───────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, email, first_name, last_name, phone,
              city, state, country, user_type, is_guest, created_at
       FROM users WHERE user_id = ?`,
      [req.user.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const u = rows[0];
    res.json({
      success: true,
      user: {
        userId:    u.user_id,
        email:     u.email,
        firstName: u.first_name,
        lastName:  u.last_name,
        phone:     u.phone,
        city:      u.city,
        state:     u.state,
        country:   u.country,
        userType:  u.user_type,
        isGuest:   Boolean(u.is_guest),
        createdAt: u.created_at,
      },
    });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// ── ADMIN LOGIN (admin_users table) ──────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const [rows] = await db.query(
      `SELECT admin_id, username, password_hash, full_name, role, is_active
       FROM admin_users WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const a = rows[0];

    if (!a.is_active) {
      return res.status(403).json({ success: false, message: 'Account inactive' });
    }

    const ok = await comparePw(password, a.password_hash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    db.query('UPDATE admin_users SET last_login = NOW() WHERE admin_id = ?', [a.admin_id]).catch(() => {});

    const token = makeToken({
      adminId:  a.admin_id,
      username: a.username,
      role:     a.role,
    });

    return res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        adminId:  a.admin_id,
        username: a.username,
        fullName: a.full_name,
        role:     a.role,
      },
    });

  } catch (err) {
    console.error('adminLogin error:', err);
    res.status(500).json({ success: false, message: 'Admin login failed' });
  }
};