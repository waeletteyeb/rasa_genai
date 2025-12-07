// ============================================================================
// DASHBOARD PAGE
// ============================================================================

import { useEffect } from 'react'
import { MessageSquare, FileText, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card } from '../components/ui'
import { useAnalyticsStore } from '../store/analyticsStore'

const mockChartData = [
    { name: 'Lun', conversations: 120, rag: 45 },
    { name: 'Mar', conversations: 150, rag: 52 },
    { name: 'Mer', conversations: 180, rag: 61 },
    { name: 'Jeu', conversations: 145, rag: 48 },
    { name: 'Ven', conversations: 200, rag: 72 },
    { name: 'Sam', conversations: 80, rag: 25 },
    { name: 'Dim', conversations: 60, rag: 18 },
]

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="relative overflow-hidden">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-400 text-sm">{title}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{Math.abs(change)}%</span>
                    <span className="text-slate-500">vs semaine dernière</span>
                </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-400" />
            </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500/5 to-purple-500/5 rounded-full" />
    </Card>
)

export default function Dashboard() {
    const { dashboard, fetchDashboard } = useAnalyticsStore()

    useEffect(() => {
        fetchDashboard('7d')
    }, [])

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-slate-400">Vue d'ensemble des performances du chatbot</p>
                </div>
                <select className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm">
                    <option value="7d">7 derniers jours</option>
                    <option value="30d">30 derniers jours</option>
                    <option value="90d">90 derniers jours</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Conversations" value={dashboard?.totalConversations || '935'} change={12} icon={MessageSquare} trend={1} />
                <StatCard title="Messages" value={dashboard?.totalMessages || '4,521'} change={8} icon={Users} trend={1} />
                <StatCard title="Documents RAG" value="24" change={3} icon={FileText} trend={1} />
                <StatCard title="Conf. Moyenne" value={(dashboard?.avgConfidence * 100 || 82).toFixed(0) + '%'} change={2} icon={TrendingUp} trend={1} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-semibold mb-4">Conversations par jour</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData}>
                                <defs>
                                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="conversations" stroke="#6366f1" fill="url(#colorConv)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="font-semibold mb-4">Requêtes RAG</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockChartData}>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="rag" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    )
}
