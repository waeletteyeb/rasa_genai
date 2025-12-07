// ============================================================================
// ANALYTICS STORE
// ============================================================================

import { create } from 'zustand'
import api from '../services/api'

export const useAnalyticsStore = create((set) => ({
    dashboard: null,
    intentStats: [],
    conversationStats: [],
    ragStats: null,
    isLoading: false,

    fetchDashboard: async (period = '7d') => {
        set({ isLoading: true })
        try {
            const { data } = await api.get('/analytics/dashboard', { params: { period } })
            set({ dashboard: data, isLoading: false })
        } catch (error) {
            set({ isLoading: false })
        }
    },

    fetchIntentStats: async (period = '7d') => {
        const { data } = await api.get('/analytics/intents', { params: { period } })
        set({ intentStats: data.data })
    },

    fetchConversationStats: async (period = '7d') => {
        const { data } = await api.get('/analytics/conversations', { params: { period } })
        set({ conversationStats: data.data })
    },

    fetchRagStats: async (period = '7d') => {
        const { data } = await api.get('/analytics/rag', { params: { period } })
        set({ ragStats: data.data })
    }
}))
