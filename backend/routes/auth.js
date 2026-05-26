const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const auth    = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name required'),
  body('lastName').trim().notEmpty().withMessage('Last name required'),
  body('userType')
    .isIn(['adopter','sponsor','both','orphanage','admin','childcare_services'])
    .withMessage('Invalid user type'),
], auth.register);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], auth.login);

// POST /api/auth/guest-login
router.post('/guest-login', auth.guestLogin);

// GET /api/auth/profile
router.get('/profile', authenticateToken, auth.getProfile);

// POST /api/auth/admin/login
router.post('/admin/login', auth.adminLogin);

module.exports = router;
