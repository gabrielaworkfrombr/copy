import { useCallback, useEffect, useRef, useState } from 'react'
import { FileText, Trash2, Upload, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { api } from '../lib/api'
import type { Contexto, ContextType } from '../types'
import { Badge } from '../components/Badge'

export function BaseDeContexto() {
  const [contextos, setContextos] = useState<Contexto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<Contexto | null>(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    api.getContextos().then(setContextos).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.md')) {
      setError('Apenas arquivos .md são aceitos')
      return
    }
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      await api.uploadContexto(form)
      load()
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleUpload(f)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deletar este documento?')) return
    try {
      await api.deleteContexto(id)
      setContextos(prev => prev.filter(c => c.id !== id))
      if (preview?.id === id) setPreview(null)
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar')
    }
  }

  const typeIcons: Record<ContextType, string> = {
    icp: '👤',
    processo: '📋',
    mercado: '📊',
    outro: '📄',
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-text-primary font-bold text-xl">Base de Contexto</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Documentos que alimentam o diagnóstico estratégico do CopyEngine.
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded text-text-primary text-sm hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
        >
          <Upload size={14} />
          {uploading ? 'Enviando...' : 'Adicionar documento'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".md"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </header>

      <div
        className="flex-1 p-6"
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-[#450A0A] border border-[#F87171]/20 rounded px-4 py-3 text-[#F87171] text-sm">
            {error}
            <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
          </div>
        )}

        {dragging && (
          <div className="mb-4 border-2 border-dashed border-primary/50 rounded-lg p-6 text-center text-primary text-sm bg-primary/5">
            Solte o arquivo .md aqui
          </div>
        )}

        {loading && (
          <div className="text-text-secondary text-sm text-center py-16">Carregando...</div>
        )}

        {!loading && (
          <div className={`grid gap-4 ${preview ? 'grid-cols-[1fr_400px]' : 'grid-cols-[repeat(auto-fill,minmax(240px,1fr))]'}`}>
            <div className={`grid gap-4 ${preview ? 'grid-cols-1' : 'contents'}`}>
              {contextos.map(ctx => (
                <div
                  key={ctx.id}
                  onClick={() => setPreview(preview?.id === ctx.id ? null : ctx)}
                  className={`bg-surface border rounded-lg p-5 cursor-pointer hover:border-primary/30 transition-colors ${
                    preview?.id === ctx.id ? 'border-primary/50' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-[#2A2A30] flex items-center justify-center text-sm">
                        {typeIcons[ctx.tipo as ContextType] || '📄'}
                      </div>
                      <Badge type="context" value={ctx.tipo as ContextType} />
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(ctx.id) }}
                      className="text-text-secondary/50 hover:text-[#F87171] transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h3 className="text-text-primary font-semibold text-sm mb-1">{ctx.nome}</h3>
                  <div className="flex items-center gap-3 text-text-secondary text-xs">
                    {ctx.nicho && <span>Nicho: {ctx.nicho}</span>}
                    <span>Data: {new Date(ctx.criado_em).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}

              <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-colors min-h-[120px]"
              >
                <FileText size={24} className="text-text-secondary mb-2" />
                <p className="text-[#F59E0B] text-xs text-center">Clique para adicionar novo contexto</p>
              </div>
            </div>

            {preview && (
              <div className="bg-surface border border-border rounded-lg flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-text-secondary" />
                    <h3 className="text-text-primary text-sm font-semibold">{preview.nome}</h3>
                  </div>
                  <button onClick={() => setPreview(null)} className="text-text-secondary hover:text-text-primary transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="prose prose-sm prose-invert max-w-none text-text-secondary">
                    <ReactMarkdown>{preview.conteudo}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
