// ============================================================================
// EMBEDDING SERVICE - Client pour le service d'embeddings Python
// ============================================================================

const axios = require('axios');
const logger = require('../config/logger');

const ACTION_SERVER_URL = process.env.ACTION_SERVER_URL || 'http://localhost:5055';

const indexChunks = async (docId, chunks, metadata = {}) => {
    try {
        // Pour l'instant, log seulement - l'indexation réelle est faite par le action server Python
        logger.info(`Indexing ${chunks.length} chunks for document ${docId}`);

        // TODO: Appeler le service Python pour indexer
        // const response = await axios.post(`${ACTION_SERVER_URL}/index`, { docId, chunks, metadata });

        return { indexed: chunks.length };
    } catch (error) {
        logger.error('Embedding service error:', error);
        throw error;
    }
};

const search = async (query, limit = 5) => {
    try {
        // TODO: Appeler le service Python pour la recherche
        logger.info(`Searching: ${query}`);

        return { results: [], query };
    } catch (error) {
        logger.error('Search error:', error);
        return { results: [], error: error.message };
    }
};

const deleteByDocId = async (docId) => {
    logger.info(`Deleting embeddings for document ${docId}`);
};

module.exports = { indexChunks, search, deleteByDocId };
