// ============================================================================
// AUTH STORE - Zustand store pour l'authentification
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const { data } = await api.post('/auth/login', { email, password })
                    set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
                    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
                    return true
                } catch (error) {
                    set({ error: error.response?.data?.error || 'Login failed', isLoading: false })
                    return false
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null })
                try {
                    const { data } = await api.post('/auth/register', userData)
                    set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
                    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
                    return true
                } catch (error) {
                    set({ error: error.response?.data?.error || 'Registration failed', isLoading: false })
                    return false
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false })
                delete api.defaults.headers.common['Authorization']
            },

            initAuth: () => {
                const { token } = get()
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                }
            }
        }),
        { name: 'auth-storage' }
    )
)
