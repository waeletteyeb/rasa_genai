// ============================================================================
// VALIDATORS - Intent
// ============================================================================

const Joi = require('joi');

const intentSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500),
    examples: Joi.array().items(Joi.object({ text: Joi.string().required() })),
    responses: Joi.array().items(Joi.object({ text: Joi.string().required() })),
    entities: Joi.array().items(Joi.object({ name: Joi.string(), type: Joi.string() })),
    isActive: Joi.boolean()
});

module.exports = { intentSchema };
