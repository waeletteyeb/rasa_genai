// ============================================================================
// INTENTS STORE
// ============================================================================

import { create } from 'zustand'
import api from '../services/api'

export const useIntentsStore = create((set, get) => ({
    intents: [],
    pagination: null,
    isLoading: false,
    error: null,

    fetchIntents: async (params = {}) => {
        set({ isLoading: true })
        try {
            const { data } = await api.get('/intents', { params })
            set({ intents: data.data, pagination: data.pagination, isLoading: false })
        } catch (error) {
            set({ error: error.message, isLoading: false })
        }
    },

    createIntent: async (intentData) => {
        try {
            const { data } = await api.post('/intents', intentData)
            set({ intents: [...get().intents, data] })
            return data
        } catch (error) {
            throw error
        }
    },

    updateIntent: async (id, intentData) => {
        try {
            const { data } = await api.put(`/intents/${id}`, intentData)
            set({ intents: get().intents.map(i => i._id === id ? data : i) })
            return data
        } catch (error) {
            throw error
        }
    },

    deleteIntent: async (id) => {
        await api.delete(`/intents/${id}`)
        set({ intents: get().intents.filter(i => i._id !== id) })
    }
}))
