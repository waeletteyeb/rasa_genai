// ============================================================================
// ANALYTICS CONTROLLER
// ============================================================================

const analyticsService = require('../services/analytics.service');

const getDashboard = async (req, res, next) => {
    try {
        const { period = '7d' } = req.query;
        const data = await analyticsService.getDashboard(period);
        res.json(data);
    } catch (error) {
        next(error);
    }
};

const getIntentStats = async (req, res, next) => {
    try {
        const { period = '7d' } = req.query;
        const stats = await analyticsService.getIntentStats(period);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const getConversationStats = async (req, res, next) => {
    try {
        const { period = '7d' } = req.query;
        const stats = await analyticsService.getConversationStats(period);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const getRagStats = async (req, res, next) => {
    try {
        const { period = '7d' } = req.query;
        const stats = await analyticsService.getRagStats(period);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboard, getIntentStats, getConversationStats, getRagStats };
