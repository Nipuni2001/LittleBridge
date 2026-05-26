const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { authenticateToken, authenticateAdmin } = require('../middleware/auth');

// User routes
router.get('/documents', authenticateToken, adoptionController.getRequiredDocuments);
router.post('/initiate', authenticateToken, adoptionController.initiateAdoption);
router.get('/my-applications', authenticateToken, adoptionController.getMyApplications);
router.get('/:applicationId/timeline', authenticateToken, adoptionController.getApplicationTimeline);
router.post('/upload-document', authenticateToken, ...adoptionController.uploadDocument);

// Admin routes
router.put('/timeline/:timelineId', authenticateAdmin, adoptionController.updateTimelineStage);

module.exports = router;

