// ============================================================================
// DATABASE CONFIG - Connexion MongoDB
// ============================================================================

const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sofrecom_chatbot';

        await mongoose.connect(uri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info('✅ MongoDB connected successfully');

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

    } catch (error) {
        logger.error('MongoDB connection failed:', error);
        throw error;
    }
};

const disconnectDB = async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
};

module.exports = { connectDB, disconnectDB };
