// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, FileText, BarChart3, Settings, Bot, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/intents', icon: MessageSquare, label: 'Intents' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/conversations', icon: Bot, label: 'Conversations' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
    const { logout, user } = useAuthStore()

    return (
        <aside className="w-64 bg-dark-100 border-r border-slate-700 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg gradient-text">Sofrecom</h1>
                        <p className="text-xs text-slate-400">Chatbot Admin</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </button>
            </div>
        </aside>
    )
}
