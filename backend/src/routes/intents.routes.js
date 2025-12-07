// ============================================================================
// INTENTS ROUTES - Gestion des intents
// ============================================================================

const express = require('express');
const router = express.Router();
const intentsController = require('../controllers/intents.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validateBody } = require('../middlewares/validation.middleware');
const { intentSchema } = require('../validators/intent.validator');

router.use(authMiddleware);

router.get('/', intentsController.getAll);
router.get('/:id', intentsController.getById);
router.post('/', validateBody(intentSchema), intentsController.create);
router.put('/:id', validateBody(intentSchema), intentsController.update);
router.delete('/:id', intentsController.delete);
router.post('/sync', intentsController.syncWithRasa);

module.exports = router;
