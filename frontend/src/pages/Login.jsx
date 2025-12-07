// ============================================================================
// LOGIN PAGE
// ============================================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading, error } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await login(email, password)
        if (success) navigate('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-200 p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-purple-600/20" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                        <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">Sofrecom Chatbot</h1>
                    <p className="text-slate-400 mt-2">Dashboard d'administration</p>
                </div>

                {/* Form */}
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                                    placeholder="admin@sofrecom.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-300">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 disabled:opacity-50"
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
