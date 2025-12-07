// ============================================================================
// DOCUMENTS ROUTES - Gestion des documents RAG
// ============================================================================

const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documents.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const upload = require('../utils/fileUpload');

router.use(authMiddleware);

router.get('/', documentsController.getAll);
router.get('/:id', documentsController.getById);
router.post('/upload', upload.single('file'), documentsController.upload);
router.post('/search', documentsController.search);
router.delete('/:id', documentsController.delete);
router.post('/:id/reindex', documentsController.reindex);

module.exports = router;
