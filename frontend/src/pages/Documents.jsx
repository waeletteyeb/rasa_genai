// ============================================================================
// DOCUMENTS PAGE
// ============================================================================

import { useEffect, useState, useRef } from 'react'
import { Upload, FileText, Trash2, RefreshCw, Search } from 'lucide-react'
import { Card, Button, Badge, Loading } from '../components/ui'
import { useDocumentsStore } from '../store/documentsStore'

export default function Documents() {
    const { documents, isLoading, uploadProgress, fetchDocuments, uploadDocument, deleteDocument } = useDocumentsStore()
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => { fetchDocuments() }, [])

    const handleDrop = async (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) await uploadDocument(file)
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (file) await uploadDocument(file)
    }

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Documents RAG</h1>
                    <p className="text-slate-400">Gérez la base de connaissances du chatbot</p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-slate-600 hover:border-slate-500'
                    }`}
                onClick={() => fileInputRef.current?.click()}
            >
                <input ref={fileInputRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary-400' : 'text-slate-400'}`} />
                <p className="font-medium">Glissez-déposez vos fichiers ici</p>
                <p className="text-sm text-slate-400 mt-1">ou cliquez pour sélectionner • PDF, TXT, DOC, DOCX • Max 10MB</p>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4 max-w-xs mx-auto">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p className="text-sm text-slate-400 mt-2">Upload en cours... {uploadProgress}%</p>
                    </div>
                )}
            </div>

            {/* Documents List */}
            {isLoading ? <Loading /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                        <Card key={doc._id} className="hover:border-primary-500/50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{doc.name}</h3>
                                    <p className="text-sm text-slate-400">{formatSize(doc.size)} • {doc.chunkCount} chunks</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                                <Badge variant={doc.status === 'indexed' ? 'success' : 'warning'}>
                                    {doc.status === 'indexed' ? 'Indexé' : 'En cours'}
                                </Badge>
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-slate-700 rounded"><RefreshCw className="w-4 h-4" /></button>
                                    <button onClick={() => deleteDocument(doc._id)}
                                        className="p-1 hover:bg-red-500/20 rounded text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
