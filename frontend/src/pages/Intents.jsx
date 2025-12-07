// ============================================================================
// INTENTS PAGE
// ============================================================================

import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, MessageSquare } from 'lucide-react'
import { Card, Button, Modal, Input, Badge, Loading } from '../components/ui'
import { useIntentsStore } from '../store/intentsStore'

export default function Intents() {
    const { intents, isLoading, fetchIntents, createIntent, updateIntent, deleteIntent } = useIntentsStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingIntent, setEditingIntent] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(() => { fetchIntents() }, [])

    const filteredIntents = intents.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            examples: formData.get('examples').split('\n').filter(Boolean).map(text => ({ text }))
        }

        if (editingIntent) {
            await updateIntent(editingIntent._id, data)
        } else {
            await createIntent(data)
        }
        setIsModalOpen(false)
        setEditingIntent(null)
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Intents</h1>
                    <p className="text-slate-400">Gérez les intentions du chatbot</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-5 h-5" /> Nouvel Intent
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Rechercher un intent..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-primary-500"
                />
            </div>

            {/* Intents Grid */}
            {isLoading ? <Loading /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIntents.map((intent) => (
                        <Card key={intent._id} className="hover:border-primary-500/50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <h3 className="font-semibold">{intent.name}</h3>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setEditingIntent(intent); setIsModalOpen(true) }}
                                        className="p-1 hover:bg-slate-700 rounded"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => deleteIntent(intent._id)}
                                        className="p-1 hover:bg-red-500/20 rounded text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">{intent.description || 'Pas de description'}</p>
                            <div className="flex items-center gap-2">
                                <Badge>{intent.examples?.length || 0} exemples</Badge>
                                <Badge variant={intent.isActive ? 'success' : 'warning'}>
                                    {intent.isActive ? 'Actif' : 'Inactif'}
                                </Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingIntent(null) }}
                title={editingIntent ? 'Modifier Intent' : 'Nouvel Intent'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" label="Nom" defaultValue={editingIntent?.name} required />
                    <Input name="description" label="Description" defaultValue={editingIntent?.description} />
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-300">Exemples (un par ligne)</label>
                        <textarea name="examples" rows={5}
                            defaultValue={editingIntent?.examples?.map(e => e.text).join('\n')}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-primary-500" />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button type="submit">Enregistrer</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
