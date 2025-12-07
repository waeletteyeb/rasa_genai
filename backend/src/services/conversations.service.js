// ============================================================================
// CONVERSATIONS SERVICE
// ============================================================================

const Conversation = require('../models/Conversation');

const getAll = async ({ page, limit, startDate, endDate }) => {
    const query = {};
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [conversations, total] = await Promise.all([
        Conversation.find(query).skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 }),
        Conversation.countDocuments(query)
    ]);

    return {
        data: conversations,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    };
};

const getById = async (id) => {
    const conversation = await Conversation.findById(id);
    if (!conversation) {
        const error = new Error('Conversation not found');
        error.statusCode = 404;
        throw error;
    }
    return conversation;
};

const getMessages = async (id) => {
    const conversation = await getById(id);
    return conversation.messages || [];
};

const deleteConversation = async (id) => {
    const conversation = await Conversation.findByIdAndDelete(id);
    if (!conversation) {
        const error = new Error('Conversation not found');
        error.statusCode = 404;
        throw error;
    }
};

module.exports = { getAll, getById, getMessages, delete: deleteConversation };
