// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

const Conversation = require('../models/Conversation');
const Analytics = require('../models/Analytics');

const getPeriodDate = (period) => {
    const now = new Date();
    const days = parseInt(period) || 7;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
};

const getDashboard = async (period) => {
    const startDate = getPeriodDate(period);

    const [totalConversations, totalMessages, avgConfidence] = await Promise.all([
        Conversation.countDocuments({ createdAt: { $gte: startDate } }),
        Conversation.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $project: { messageCount: { $size: { $ifNull: ['$messages', []] } } } },
            { $group: { _id: null, total: { $sum: '$messageCount' } } }
        ]),
        Analytics.aggregate([
            { $match: { createdAt: { $gte: startDate }, type: 'nlu' } },
            { $group: { _id: null, avg: { $avg: '$confidence' } } }
        ])
    ]);

    return {
        totalConversations,
        totalMessages: totalMessages[0]?.total || 0,
        avgConfidence: avgConfidence[0]?.avg || 0,
        period
    };
};

const getIntentStats = async (period) => {
    const startDate = getPeriodDate(period);

    const stats = await Analytics.aggregate([
        { $match: { createdAt: { $gte: startDate }, type: 'nlu' } },
        { $group: { _id: '$intent', count: { $sum: 1 }, avgConfidence: { $avg: '$confidence' } } },
        { $sort: { count: -1 } },
        { $limit: 20 }
    ]);

    return { data: stats, period };
};

const getConversationStats = async (period) => {
    const startDate = getPeriodDate(period);

    const daily = await Conversation.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);

    return { data: daily, period };
};

const getRagStats = async (period) => {
    const startDate = getPeriodDate(period);

    const stats = await Analytics.aggregate([
        { $match: { createdAt: { $gte: startDate }, type: 'rag' } },
        { $group: { _id: null, total: { $sum: 1 }, avgRelevance: { $avg: '$relevance' } } }
    ]);

    return { data: stats[0] || { total: 0, avgRelevance: 0 }, period };
};

module.exports = { getDashboard, getIntentStats, getConversationStats, getRagStats };
