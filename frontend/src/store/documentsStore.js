// ============================================================================
// DOCUMENTS STORE
// ============================================================================

import { create } from 'zustand'
import api from '../services/api'

export const useDocumentsStore = create((set, get) => ({
    documents: [],
    pagination: null,
    isLoading: false,
    uploadProgress: 0,

    fetchDocuments: async (params = {}) => {
        set({ isLoading: true })
        try {
            const { data } = await api.get('/documents', { params })
            set({ documents: data.data, pagination: data.pagination, isLoading: false })
        } catch (error) {
            set({ isLoading: false })
        }
    },

    uploadDocument: async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        set({ uploadProgress: 0 })

        const { data } = await api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                set({ uploadProgress: Math.round((e.loaded * 100) / e.total) })
            }
        })

        set({ documents: [data, ...get().documents], uploadProgress: 100 })
        return data
    },

    deleteDocument: async (id) => {
        await api.delete(`/documents/${id}`)
        set({ documents: get().documents.filter(d => d._id !== id) })
    }
}))
