// ============================================================================
// ROUTES INDEX - Agrégation des routes
// ============================================================================

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const intentsRoutes = require('./intents.routes');
const documentsRoutes = require('./documents.routes');
const conversationsRoutes = require('./conversations.routes');
const analyticsRoutes = require('./analytics.routes');

// Routes publiques
router.use('/auth', authRoutes);

// Routes protégées
router.use('/intents', intentsRoutes);
router.use('/documents', documentsRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/analytics', analyticsRoutes);

// Documentation API
router.get('/docs', (req, res) => {
    res.json({
        name: 'Sofrecom Chatbot API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            intents: '/api/intents',
            documents: '/api/documents',
            conversations: '/api/conversations',
            analytics: '/api/analytics'
        }
    });
});

module.exports = router;
