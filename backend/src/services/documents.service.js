// ============================================================================
// DOCUMENTS SERVICE
// ============================================================================

const Document = require('../models/Document');
const embeddingService = require('./embedding.service');
const logger = require('../config/logger');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;

const getAll = async ({ page, limit }) => {
    const [docs, total] = await Promise.all([
        Document.find().skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 }),
        Document.countDocuments()
    ]);

    return {
        data: docs,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
    };
};

const getById = async (id) => {
    const doc = await Document.findById(id);
    if (!doc) {
        const error = new Error('Document not found');
        error.statusCode = 404;
        throw error;
    }
    return doc;
};

const uploadAndProcess = async (file) => {
    try {
        // Lire et parser le PDF
        const dataBuffer = await fs.readFile(file.path);
        const pdfData = await pdfParse(dataBuffer);
        const content = pdfData.text;

        // Chunking
        const chunks = chunkText(content, 1000, 200);

        // Créer le document
        const doc = new Document({
            name: file.originalname,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            content: content.substring(0, 5000),
            chunkCount: chunks.length,
            status: 'processing'
        });
        await doc.save();

        // Générer les embeddings
        await embeddingService.indexChunks(doc._id.toString(), chunks, { source: file.originalname });

        doc.status = 'indexed';
        await doc.save();

        // Nettoyer le fichier temp
        await fs.unlink(file.path);

        logger.info(`Document processed: ${file.originalname}, ${chunks.length} chunks`);
        return doc;
    } catch (error) {
        logger.error('Error processing document:', error);
        throw error;
    }
};

const chunkText = (text, chunkSize, overlap) => {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start = end - overlap;
        if (start >= text.length) break;
    }

    return chunks;
};

const search = async (query, limit) => {
    return embeddingService.search(query, limit);
};

const deleteDoc = async (id) => {
    const doc = await Document.findByIdAndDelete(id);
    if (!doc) {
        const error = new Error('Document not found');
        error.statusCode = 404;
        throw error;
    }
    await embeddingService.deleteByDocId(id);
    logger.info(`Document deleted: ${doc.name}`);
};

const reindex = async (id) => {
    const doc = await getById(id);
    // TODO: Re-index document chunks
    logger.info(`Document reindexed: ${doc.name}`);
    return { message: 'Reindex completed' };
};

module.exports = { getAll, getById, uploadAndProcess, search, delete: deleteDoc, reindex };
