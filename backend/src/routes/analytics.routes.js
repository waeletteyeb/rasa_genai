// ============================================================================
// ANALYTICS ROUTES
// ============================================================================

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/intents', analyticsController.getIntentStats);
router.get('/conversations', analyticsController.getConversationStats);
router.get('/rag', analyticsController.getRagStats);

module.exports = router;
