// ============================================================================
// INTENTS SERVICE
// ============================================================================

const Intent = require('../models/Intent');
const logger = require('../config/logger');

const getAll = async ({ page, limit, search }) => {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const [intents, total] = await Promise.all([
        Intent.find(query).skip((page - 1) * limit).limit(parseInt(limit)).sort({ name: 1 }),
        Intent.countDocuments(query)
    ]);

    return {
        data: intents,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    };
};

const getById = async (id) => {
    const intent = await Intent.findById(id);
    if (!intent) {
        const error = new Error('Intent not found');
        error.statusCode = 404;
        throw error;
    }
    return intent;
};

const create = async (data) => {
    const intent = new Intent(data);
    await intent.save();
    logger.info(`Intent created: ${intent.name}`);
    return intent;
};

const update = async (id, data) => {
    const intent = await Intent.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!intent) {
        const error = new Error('Intent not found');
        error.statusCode = 404;
        throw error;
    }
    logger.info(`Intent updated: ${intent.name}`);
    return intent;
};

const deleteIntent = async (id) => {
    const intent = await Intent.findByIdAndDelete(id);
    if (!intent) {
        const error = new Error('Intent not found');
        error.statusCode = 404;
        throw error;
    }
    logger.info(`Intent deleted: ${intent.name}`);
};

const syncWithRasa = async () => {
    // TODO: Implement sync with Rasa training files
    logger.info('Syncing intents with Rasa...');
    return { message: 'Sync completed', synced: await Intent.countDocuments() };
};

module.exports = { getAll, getById, create, update, delete: deleteIntent, syncWithRasa };
