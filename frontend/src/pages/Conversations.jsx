// ============================================================================
// CONVERSATIONS PAGE
// ============================================================================

import { useState } from 'react'
import { MessageSquare, User, Bot, Calendar, Search } from 'lucide-react'
import { Card, Badge } from '../components/ui'

const mockConversations = [
    {
        id: '1', senderId: 'user_123', messages: [
            { role: 'user', text: 'Bonjour, quels sont vos services ?', timestamp: '10:30' },
            { role: 'bot', text: 'Nous proposons une gamme complète de services incluant le conseil, le développement et le cloud.', timestamp: '10:30' },
            { role: 'user', text: 'Quels sont vos tarifs ?', timestamp: '10:31' },
            { role: 'bot', text: 'Nos tarifs dépendent du type de projet. Je vous invite à contacter notre équipe commerciale.', timestamp: '10:31' }
        ], createdAt: '2024-01-15'
    },
    {
        id: '2', senderId: 'user_456', messages: [
            { role: 'user', text: "J'ai un problème technique", timestamp: '14:22' },
            { role: 'bot', text: 'Je suis désolé pour ce désagrément. Pouvez-vous me décrire le problème ?', timestamp: '14:22' }
        ], createdAt: '2024-01-15'
    }
]

export default function Conversations() {
    const [selectedConv, setSelectedConv] = useState(mockConversations[0])
    const [search, setSearch] = useState('')

    return (
        <div className="animate-fadeIn h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Conversations</h1>
                    <p className="text-slate-400">Historique des échanges avec le chatbot</p>
                </div>
            </div>

            <div className="flex gap-6 h-full">
                {/* Conversations List */}
                <div className="w-80 flex-shrink-0 flex flex-col">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-primary-500" />
                    </div>

                    <div className="flex-1 overflow-auto space-y-2">
                        {mockConversations.map((conv) => (
                            <div key={conv.id} onClick={() => setSelectedConv(conv)}
                                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedConv?.id === conv.id ? 'bg-primary-600/20 border border-primary-500/50' : 'bg-dark-100 border border-slate-700 hover:border-slate-600'
                                    }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                        {conv.senderId.charAt(5).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{conv.senderId}</p>
                                        <p className="text-xs text-slate-400">{conv.createdAt}</p>
                                    </div>
                                    <Badge>{conv.messages.length}</Badge>
                                </div>
                                <p className="text-sm text-slate-400 truncate">{conv.messages[0]?.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conversation Detail */}
                <Card className="flex-1 flex flex-col">
                    {selectedConv ? (
                        <>
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                                    {selectedConv.senderId.charAt(5).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold">{selectedConv.senderId}</p>
                                    <p className="text-sm text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {selectedConv.createdAt}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto py-4 space-y-4">
                                {selectedConv.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-primary-500'
                                            }`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className={`max-w-[70%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-500/20 text-right' : 'bg-slate-700'
                                            }`}>
                                            <p>{msg.text}</p>
                                            <p className="text-xs text-slate-400 mt-1">{msg.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">
                            Sélectionnez une conversation
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
