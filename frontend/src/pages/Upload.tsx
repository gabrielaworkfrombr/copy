import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, Shield, Zap, Brain } from 'lucide-react'
import { api } from '../lib/api'
import type { Contexto } from '../types'

export function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [nome, setNome] = useState('')
  const [contextoId, setContextoId] = useState('')
  const [contextos, setContextos] = useState<Contexto[]>([])
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.getContextos().then(setContextos).catch(() => {})
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) setFile(f)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !nome.trim()) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('nome', nome)
      if (contextoId) form.append('contexto_id', contextoId)
      const res = await api.uploadCampanha(form)
      navigate(`/?campanha=${res.id}`)
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen bg-bg">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Nova Campanha de Análise</h1>
          <p className="text-text-secondary text-sm">
            Importe seus dados e defina o contexto estratégico para gerar diagnósticos de alta performance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-6 space-y-5">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              dragging
                ? 'border-primary bg-primary/5'
                : file
                  ? 'border-[#4ADE80] bg-[#14532D]/20'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
              <UploadIcon size={24} className="text-primary" />
            </div>
            {file ? (
              <>
                <p className="text-text-primary text-sm font-medium">{file.name}</p>
                <p className="text-text-secondary text-xs mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <p className="text-text-primary text-sm font-medium">Arraste o CSV aqui ou clique para selecionar</p>
                <p className="text-text-secondary text-xs mt-1">Suporta apenas arquivos .CSV (Max. 10MB)</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-1.5">Nome da campanha</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Lançamento Outono 2024"
                className="w-full bg-bg border border-border rounded px-3 py-2 text-text-primary text-sm placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-1.5">Vincular contexto</label>
              <select
                value={contextoId}
                onChange={e => setContextoId(e.target.value)}
                className="w-full bg-bg border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                style={{ color: contextoId ? '#F4F4F5' : '#A1A1AA' }}
              >
                <option value="">Selecione um contexto...</option>
                {contextos.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-[#F87171] text-xs bg-[#450A0A] px-3 py-2 rounded">{error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!file || !nome.trim() || loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar campanha →'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: <Shield size={18} />, title: 'Dados Seguros', desc: 'Seus arquivos são processados localmente e nunca compartilhados.' },
            { icon: <Zap size={18} />, title: 'Processamento Rápido', desc: 'IA otimizada para analisar milhares de linhas em segundos.' },
            { icon: <Brain size={18} />, title: 'IA Treinada', desc: 'Algoritmos especialistas em gatilhos mentais e conversão.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-surface border border-border rounded-lg p-4 text-center">
              <div className="flex justify-center text-primary mb-2">{icon}</div>
              <div className="text-text-primary text-xs font-semibold mb-1">{title}</div>
              <div className="text-text-secondary text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
