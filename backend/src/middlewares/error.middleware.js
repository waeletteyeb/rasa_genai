// ============================================================================
// ERROR MIDDLEWARE
// ============================================================================

const logger = require('../config/logger');

const errorMiddleware = (err, req, res, next) => {
    logger.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorMiddleware;
