const express = require('express');
const router  = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

router.post('/', [
  body('firstName').trim().notEmpty().withMessage('First name required'),
  body('lastName').trim().notEmpty().withMessage('Last name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('interest').trim().notEmpty().withMessage('Please select an interest'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(400).json({ success: false, message: errs.array()[0].msg });
  }

  const { firstName, lastName, email, interest, message } = req.body;

  // Save to DB
  try {
    await db.query(
      `INSERT INTO contact_submissions (first_name, last_name, email, interest, message)
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, interest, message]
    );
  } catch (err) {
    console.error('Contact save error:', err.message);
  }

  try {
    const emailService = require('../services/emailService');
    await emailService.sendContactFormEmail(firstName, lastName, email, interest, message);
  } catch (err) {
    console.warn('Contact email not sent (SMTP may not be configured):', err.message);
  }

  res.json({
    success: true,
    message: 'Thank you! We received your message and will respond within one business day.',
  });
});

module.exports = router;
