// ============================================================================
// HEADER COMPONENT
// ============================================================================

import { Bell, Search } from 'lucide-react'

export default function Header() {
    return (
        <header className="h-16 bg-dark-100 border-b border-slate-700 flex items-center justify-between px-6">
            {/* Search */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                <div className="h-8 w-px bg-slate-700" />

                <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-slate-400">Rasa Online</span>
                </div>
            </div>
        </header>
    )
}
