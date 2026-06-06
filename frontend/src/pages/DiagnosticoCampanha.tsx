import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Skull, Trophy, FileText, Zap, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import type { DiagnosticoCampanha as IDiagnosticoCampanha, Campanha } from '../types'
import { DiagnosticoBox } from '../components/DiagnosticoBox'

export function DiagnosticoCampanha() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [campanha, setCampanha] = useState<Campanha | null>(null)
  const [diagnostico, setDiagnostico] = useState<IDiagnosticoCampanha | null>(null)
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    Promise.all([
      api.getCampanha(id).catch(() => null),
      api.getDiagnosticoCampanha(id).catch(() => null),
    ]).then(([camp, diag]) => {
      setCampanha(camp)
      if (diag?.conteudo) setDiagnostico(diag.conteudo)
    }).finally(() => setLoading(false))
  }, [id])

  const handleGerar = async () => {
    if (!id) return
    setGerando(true)
    setError('')
    try {
      const res = await api.gerarDiagnosticoCampanha(id)
      setDiagnostico(res.conteudo)
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar diagnóstico')
    } finally {
      setGerando(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-text-primary font-bold text-xl">
              Diagnóstico: {campanha?.nome || '...'}
            </h1>
          </div>
          {diagnostico && (
            <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              <CheckCircle size={12} />
              Análise de IA Concluída
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/?campanha=${id}`)}
            className="px-3 py-1.5 text-xs text-text-secondary border border-border rounded hover:border-primary/50 hover:text-text-primary transition-colors"
          >
            + Add Document
          </button>
          <button
            onClick={handleGerar}
            disabled={gerando}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={14} className={gerando ? 'animate-spin' : ''} />
            {gerando ? 'Gerando...' : 'Regerar diagnóstico'}
          </button>
        </div>
      </header>

      <div className="p-6 flex-1 space-y-5">
        {loading && (
          <div className="text-text-secondary text-sm text-center py-16">Carregando...</div>
        )}

        {!loading && !diagnostico && !gerando && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
              <Zap size={24} className="text-text-secondary" />
            </div>
            <h2 className="text-text-primary font-semibold text-lg mb-2">Diagnóstico não gerado</h2>
            <p className="text-text-secondary text-sm mb-6 max-w-xs text-center">
              Clique em "Regerar diagnóstico" para analisar todos os anúncios desta campanha com IA.
            </p>
            <button
              onClick={handleGerar}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors"
            >
              <RefreshCw size={14} />
              Gerar diagnóstico
            </button>
          </div>
        )}

        {gerando && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <RefreshCw size={24} className="text-primary animate-spin" />
            </div>
            <p className="text-text-secondary text-sm">Analisando anúncios com IA...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-[#450A0A] border border-[#F87171]/20 rounded-lg px-4 py-3 text-[#F87171] text-sm">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {diagnostico && !gerando && (
          <>
            <div className="bg-surface border border-border rounded-lg px-5 py-4">
              <p className="text-text-secondary text-sm leading-relaxed">
                Com base nos dados das últimas 72 horas, detectamos padrões críticos nesta campanha.
                Abaixo, o detalhamento estratégico para reverter o quadro e escalar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DiagnosticoBox
                icon={<Skull size={16} />}
                title="O que os mortos têm em comum"
                content={diagnostico.padrao_mortos}
                badge={
                  <span className="px-2 py-0.5 bg-[#450A0A] text-[#F87171] text-xs font-medium rounded">
                    ALTO RISCO
                  </span>
                }
              />
              <DiagnosticoBox
                icon={<Trophy size={16} />}
                title="O padrão dos vencedores"
                content={diagnostico.padrao_vencedores}
                badge={
                  <span className="px-2 py-0.5 bg-[#14532D] text-[#4ADE80] text-xs font-medium rounded">
                    ESCALÁVEL
                  </span>
                }
              />
              <DiagnosticoBox
                icon={<FileText size={16} />}
                title="O que a legenda revela"
                content={diagnostico.o_que_legenda_revela}
              />
              <div className="bg-surface border border-border rounded-lg p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className="text-primary" />
                  <h3 className="text-text-primary font-semibold text-sm">Ação Concreta</h3>
                </div>
                <div className="mb-4">
                  <div className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2">
                    Plano de Execução:
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {diagnostico.acao_concreta}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 px-3 py-2 bg-primary/90 text-white text-xs font-medium rounded hover:bg-primary transition-colors">
                    Aplicar Alterações agora
                  </button>
                  <button className="flex-1 px-3 py-2 bg-surface border border-border text-text-secondary text-xs font-medium rounded hover:text-text-primary transition-colors">
                    Agendar para amanhã
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'CTR Médio', value: '—' },
                { label: 'Custo por Lead', value: '—' },
                { label: 'ROAS Estimado', value: '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface border border-border rounded-lg px-4 py-3">
                  <div className="text-text-secondary text-xs mb-1">{label}</div>
                  <div className="text-text-primary text-xl font-bold">{value}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
