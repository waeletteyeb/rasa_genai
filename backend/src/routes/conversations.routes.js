// ============================================================================
// CONVERSATIONS ROUTES
// ============================================================================

const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversations.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', conversationsController.getAll);
router.get('/:id', conversationsController.getById);
router.get('/:id/messages', conversationsController.getMessages);
router.delete('/:id', conversationsController.delete);

module.exports = router;
