// ============================================================================
// INTENTS CONTROLLER
// ============================================================================

const intentsService = require('../services/intents.service');

const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const result = await intentsService.getAll({ page, limit, search });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const intent = await intentsService.getById(req.params.id);
        res.json(intent);
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const intent = await intentsService.create(req.body);
        res.status(201).json(intent);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const intent = await intentsService.update(req.params.id, req.body);
        res.json(intent);
    } catch (error) {
        next(error);
    }
};

const deleteIntent = async (req, res, next) => {
    try {
        await intentsService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const syncWithRasa = async (req, res, next) => {
    try {
        const result = await intentsService.syncWithRasa();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, delete: deleteIntent, syncWithRasa };
