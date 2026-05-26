const express = require('express');
const router  = express.Router();
const oc      = require('../controllers/orphanageController');
const ac      = require('../controllers/adoptionController');
const { authenticateToken, authenticateAdmin, optionalAuth } = require('../middleware/auth');

// ── Public — no auth needed ────────────────────────────────────
router.get('/nearby',         optionalAuth, oc.getNearbyOrphanages);
router.get('/search',         optionalAuth, oc.searchOrphanages);
router.post('/parse-map-url',              oc.parseMapUrl);

// ── Orphanage user — self-service ──────────────────────────────
// NOTE: these MUST be before /:id or Express captures 'my-orphanage' as an id
router.get('/my-orphanage',   authenticateToken, oc.getMyOrphanage);
router.post('/register',      authenticateToken, oc.registerOrphanage);

// ── Childcare / Admin — pending review ────────────────────────
// NOTE: /pending MUST be before /:id
router.get('/pending',        authenticateToken, oc.getPendingOrphanages);

// ── Document review routes ─────────────────────────────────────
// NOTE: /documents/pending MUST be before /:id
router.get('/documents/pending',           authenticateToken, ac.getPendingDocuments);
router.put('/documents/:uploadId/review',  authenticateToken, ac.reviewDocument);

// ── Approval / rejection ───────────────────────────────────────
router.put('/:id/approve',    authenticateToken, oc.approveOrphanage);
router.put('/:id/reject',     authenticateToken, oc.rejectOrphanage);

// ── Donation needs CRUD ─────────────────────────────────────────
// All needs routes before /:id wildcard
router.get('/orphanages/:orphanageId/needs',          authenticateToken, oc.getDonationNeeds);   // shouldn't be needed but kept for clarity, and in case we want to allow public viewing of needs in the future
router.get('/:orphanageId/needs',                     authenticateToken, oc.getDonationNeeds);
router.post('/:orphanageId/needs',                    authenticateToken, oc.addDonationNeed);
router.put('/:orphanageId/needs/:needId',             authenticateToken, oc.updateDonationNeed);
router.delete('/:orphanageId/needs/:needId',          authenticateToken, oc.deleteDonationNeed);

// ── Available slots ─────────────────────────────────────────────
router.get('/:orphanageId/slots', authenticateToken, oc.getAvailableSlots);

// ── Admin create (auto-approved) ───────────────────────────────
router.post('/', authenticateAdmin, oc.createOrphanage);

// ── Wildcard — MUST be LAST ────────────────────────────────────
router.get('/:id', optionalAuth, oc.getOrphanageById);

module.exports = router;
