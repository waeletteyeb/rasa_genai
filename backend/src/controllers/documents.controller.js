// ============================================================================
// DOCUMENTS CONTROLLER
// ============================================================================

const documentsService = require('../services/documents.service');
const logger = require('../config/logger');

const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const result = await documentsService.getAll({ page, limit });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const doc = await documentsService.getById(req.params.id);
        res.json(doc);
    } catch (error) {
        next(error);
    }
};

const upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        logger.info(`Uploading file: ${req.file.originalname}`);
        const result = await documentsService.uploadAndProcess(req.file);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const search = async (req, res, next) => {
    try {
        const { query, limit = 5 } = req.body;
        const results = await documentsService.search(query, limit);
        res.json(results);
    } catch (error) {
        next(error);
    }
};

const deleteDoc = async (req, res, next) => {
    try {
        await documentsService.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const reindex = async (req, res, next) => {
    try {
        const result = await documentsService.reindex(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, upload, search, delete: deleteDoc, reindex };
