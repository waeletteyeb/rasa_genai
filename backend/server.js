// ============================================================================
// SERVER.JS - Point d'entrée du backend Express
// ============================================================================

require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 3001;

// Connexion à la base de données puis démarrage du serveur
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📚 API Docs: http://localhost:${PORT}/api/docs`);
            logger.info(`🔗 Health: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

startServer();
