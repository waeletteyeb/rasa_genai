// ============================================================================
// API SERVICE - Axios instance centralisée
// ============================================================================

import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
    const storage = localStorage.getItem('auth-storage')
    if (storage) {
        const { state } = JSON.parse(storage)
        if (state.token) {
            config.headers.Authorization = `Bearer ${state.token}`
        }
    }
    return config
})

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth-storage')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
