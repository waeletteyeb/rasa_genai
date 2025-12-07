// ============================================================================
// UI COMPONENTS
// ============================================================================

import { clsx } from 'clsx'

// Button
export function Button({ children, variant = 'primary', className, ...props }) {
    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'hover:bg-slate-700 text-slate-300'
    }

    return (
        <button
            className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}

// Card
export function Card({ children, className, ...props }) {
    return (
        <div
            className={clsx('bg-dark-100 rounded-xl border border-slate-700 p-6', className)}
            {...props}
        >
            {children}
        </div>
    )
}

// Input
export function Input({ label, error, className, ...props }) {
    return (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
            <input
                className={clsx(
                    'w-full px-4 py-2 bg-slate-800 border rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors',
                    error ? 'border-red-500' : 'border-slate-600',
                    className
                )}
                {...props}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
    )
}

// Modal
export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-dark-100 rounded-xl border border-slate-700 p-6 w-full max-w-lg animate-fadeIn">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                {children}
            </div>
        </div>
    )
}

// Loading
export function Loading() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}

// Badge
export function Badge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-slate-700 text-slate-300',
        success: 'bg-green-500/20 text-green-400',
        warning: 'bg-yellow-500/20 text-yellow-400',
        danger: 'bg-red-500/20 text-red-400'
    }

    return (
        <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', variants[variant])}>
            {children}
        </span>
    )
}
