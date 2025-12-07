// ============================================================================
// CONVERSATIONS CONTROLLER
// ============================================================================

const conversationsService = require('../services/conversations.service');

const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, startDate, endDate } = req.query;
        const result = await conversationsService.getAll({ page, limit, startDate, endDate });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const conversation = await conversationsService.getById(req.params.id);
        res.json(conversation);
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const messages = await conversationsService.getMessages(req.params.id);
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

const deleteConversation = async (req, res, next) => {
    try {
        await conversationsService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, getMessages, delete: deleteConversation };
