// ============================================================================
// ANALYTICS PAGE
// ============================================================================

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card } from '../components/ui'

const intentData = [
    { name: 'greet', count: 450 },
    { name: 'ask_services', count: 380 },
    { name: 'ask_pricing', count: 290 },
    { name: 'ask_support', count: 210 },
    { name: 'goodbye', count: 180 },
]

const sourceData = [
    { name: 'NLU Direct', value: 65 },
    { name: 'RAG Fallback', value: 25 },
    { name: 'Human Handoff', value: 10 },
]

const COLORS = ['#6366f1', '#a855f7', '#ec4899']

export default function Analytics() {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-slate-400">Analyse détaillée des performances</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Intent Distribution */}
                <Card>
                    <h3 className="font-semibold mb-4">Distribution des Intents</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={intentData} layout="vertical">
                                <XAxis type="number" stroke="#64748b" />
                                <YAxis type="category" dataKey="name" stroke="#64748b" width={100} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Response Source */}
                <Card>
                    <h3 className="font-semibold mb-4">Source des Réponses</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={sourceData} innerRadius={60} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Confidence Distribution */}
                <Card className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Métriques de Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                            <p className="text-3xl font-bold text-primary-400">82%</p>
                            <p className="text-sm text-slate-400 mt-1">Confiance NLU moyenne</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                            <p className="text-3xl font-bold text-green-400">94%</p>
                            <p className="text-sm text-slate-400 mt-1">Taux de résolution</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                            <p className="text-3xl font-bold text-purple-400">1.2s</p>
                            <p className="text-sm text-slate-400 mt-1">Temps de réponse moyen</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                            <p className="text-3xl font-bold text-yellow-400">4.5</p>
                            <p className="text-sm text-slate-400 mt-1">Note satisfaction /5</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
