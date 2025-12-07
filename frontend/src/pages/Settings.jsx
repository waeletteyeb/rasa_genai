// ============================================================================
// SETTINGS PAGE
// ============================================================================

import { useState } from 'react'
import { Save, Key, Sliders, Bell } from 'lucide-react'
import { Card, Button, Input } from '../components/ui'

export default function Settings() {
    const [settings, setSettings] = useState({
        confidenceThreshold: 0.75,
        maxTokens: 1024,
        temperature: 0.7,
        topK: 5
    })

    const handleSave = () => {
        console.log('Saving settings:', settings)
        // TODO: Save to backend
    }

    return (
        <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-slate-400">Configuration du chatbot et des services</p>
            </div>

            {/* LLM Settings */}
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                        <Sliders className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Paramètres LLM</h3>
                        <p className="text-sm text-slate-400">Configuration du modèle de langage</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Seuil de confiance NLU ({(settings.confidenceThreshold * 100).toFixed(0)}%)
                        </label>
                        <input type="range" min="0.5" max="0.95" step="0.05" value={settings.confidenceThreshold}
                            onChange={(e) => setSettings({ ...settings, confidenceThreshold: parseFloat(e.target.value) })}
                            className="w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Température ({settings.temperature})
                        </label>
                        <input type="range" min="0" max="1" step="0.1" value={settings.temperature}
                            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                            className="w-full" />
                    </div>
                    <Input label="Max Tokens" type="number" value={settings.maxTokens}
                        onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })} />
                    <Input label="Top K (RAG)" type="number" value={settings.topK}
                        onChange={(e) => setSettings({ ...settings, topK: parseInt(e.target.value) })} />
                </div>
            </Card>

            {/* API Keys */}
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <Key className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Clés API</h3>
                        <p className="text-sm text-slate-400">Configuration des services externes</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Input label="OpenAI API Key" type="password" placeholder="sk-..." />
                    <Input label="Rasa Server URL" placeholder="http://localhost:5005" />
                </div>
            </Card>

            {/* Notifications */}
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Notifications</h3>
                        <p className="text-sm text-slate-400">Alertes et notifications</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {['Alerte confiance faible', 'Nouveau document indexé', 'Erreur système'].map((item) => (
                        <label key={item} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600" />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave}>
                    <Save className="w-5 h-5" /> Enregistrer
                </Button>
            </div>
        </div>
    )
}
