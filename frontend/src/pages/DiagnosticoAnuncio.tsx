import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Anchor, AlignLeft, Star, Zap, RefreshCw, AlertTriangle } from 'lucide-react'
import { api } from '../lib/api'
import type { Anuncio, DiagnosticoAnuncio as IDiagnosticoAnuncio } from '../types'
import { Badge } from '../components/Badge'
import { DiagnosticoBox } from '../components/DiagnosticoBox'

export function DiagnosticoAnuncio() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null)
  const [diagnostico, setDiagnostico] = useState<IDiagnosticoAnuncio | null>(null)
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.getAnuncio(id),
      api.getDiagnosticoAnuncio(id).catch(() => null),
    ]).then(([ad, diag]) => {
      setAnuncio(ad)
      if (diag?.conteudo) setDiagnostico(diag.conteudo)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  const handleGerar = async () => {
    if (!id) return
    setGerando(true)
    setError('')
    try {
      const res = await api.gerarDiagnosticoAnuncio(id)
      setDiagnostico(res.conteudo)
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar diagnóstico')
    } finally {
      setGerando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-text-secondary text-sm">Carregando...</p>
      </div>
    )
  }

  const copyText = [anuncio?.legenda, anuncio?.texto_imagem, anuncio?.texto_video]
    .filter(Boolean)
    .join('\n\n')

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-text-primary font-bold text-xl">{anuncio?.nome_anuncio}</h1>
            <p className="text-text-secondary text-xs">Análise de performance comparativa</p>
          </div>
          {anuncio && <Badge type="status" value={anuncio.status} />}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-text-secondary text-xs">CTR</div>
            <div className="text-text-primary font-bold">
              {anuncio?.ctr != null ? `${(anuncio.ctr * 100).toFixed(1)}%` : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-text-secondary text-xs">CPL</div>
            <div className="text-text-primary font-bold">
              {anuncio?.cpl != null ? `R$ ${anuncio.cpl.toFixed(2)}` : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-text-secondary text-xs">Score IA</div>
            <div className="text-text-primary font-bold">—/10</div>
          </div>
        </div>
      </header>

      <div className="p-6 flex-1">
        <div className="grid grid-cols-[300px_1fr_1fr] gap-5">
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-text-secondary text-xs font-medium uppercase tracking-wider">Original Ad Copy</h3>
                <button className="text-text-secondary/50 hover:text-text-secondary transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>
              <p className="text-primary text-sm font-medium leading-relaxed italic mb-3">
                {copyText || 'Sem copy disponível'}
              </p>
              <div className="h-24 rounded bg-[#2A2A30] flex items-center justify-center">
                <span className="text-text-secondary text-xs">VISUAL ASSET</span>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text-secondary">
              Analyst ID: AUTO-GEN • {anuncio?.criado_em ? new Date(anuncio.criado_em).toLocaleDateString('pt-BR') : '—'}
            </div>
          </div>

          <div className="space-y-4">
            {diagnostico ? (
              <>
                <DiagnosticoBox
                  icon={<Anchor size={15} />}
                  title="Análise do hook"
                  content={diagnostico.analise_hook}
                />
                <DiagnosticoBox
                  icon={<AlignLeft size={15} />}
                  title="Análise da legenda"
                  content={diagnostico.analise_legenda}
                />
              </>
            ) : (
              <div className="bg-surface border border-border rounded-lg p-8 flex flex-col items-center justify-center h-full text-center">
                <Zap size={24} className="text-text-secondary mb-3" />
                <p className="text-text-secondary text-sm mb-4">Diagnóstico ainda não gerado</p>
                <button
                  onClick={handleGerar}
                  disabled={gerando}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw size={14} className={gerando ? 'animate-spin' : ''} />
                  {gerando ? 'Gerando...' : 'Gerar diagnóstico'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {diagnostico && (
              <>
                <div className="bg-surface border border-border rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star size={14} className="text-primary" />
                    </div>
                    <h3 className="text-text-primary font-bold text-sm">Veredicto Final</h3>
                  </div>
                  <p className="text-text-primary font-semibold text-base leading-snug">
                    {diagnostico.veredicto}
                  </p>
                </div>

                <div className="bg-surface border border-border rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={15} className="text-[#F59E0B]" />
                    <h3 className="text-text-primary font-semibold text-sm">Ação concreta</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {diagnostico.acao_concreta}
                  </p>
                  <button className="w-full px-3 py-2 bg-[#F59E0B] text-[#451A03] text-xs font-bold rounded hover:bg-[#F59E0B]/90 transition-colors flex items-center justify-center gap-1.5">
                    <RefreshCw size={12} />
                    Executar Variações
                  </button>
                </div>
              </>
            )}

            {gerando && (
              <div className="bg-surface border border-border rounded-lg p-8 flex flex-col items-center justify-center">
                <RefreshCw size={24} className="text-primary animate-spin mb-3" />
                <p className="text-text-secondary text-sm">Analisando com IA...</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-4 bg-[#450A0A] border border-[#F87171]/20 rounded-lg px-4 py-3 text-[#F87171] text-sm">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {diagnostico && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleGerar}
              disabled={gerando}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={14} className={gerando ? 'animate-spin' : ''} />
              Regerar diagnóstico
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
