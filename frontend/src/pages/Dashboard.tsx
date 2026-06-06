import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TrendingUp, DollarSign, BarChart2, Hash, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'
import type { Campanha, Anuncio } from '../types'
import { GraficoCTR } from '../components/GraficoCTR'
import { AnuncioCard } from '../components/AnuncioCard'

export function Dashboard() {
  const [searchParams] = useSearchParams()
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [campanhaAtiva, setCampanhaAtiva] = useState<Campanha | null>(null)
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.getCampanhas().then(data => {
      setCampanhas(data)
      const paramId = searchParams.get('campanha')
      const alvo = data.find((c: Campanha) => c.id === paramId) || data[0] || null
      setCampanhaAtiva(alvo)
    }).catch(() => setLoading(false))
  }, [searchParams])

  useEffect(() => {
    if (!campanhaAtiva) { setLoading(false); return }
    setLoading(true)
    api.getAnuncios(campanhaAtiva.id).then(data => {
      setAnuncios(data)
    }).finally(() => setLoading(false))
  }, [campanhaAtiva])

  const ctrMedio = anuncios.length
    ? anuncios.reduce((s, a) => s + (a.ctr || 0), 0) / anuncios.length
    : 0
  const cplMedio = anuncios.filter(a => a.cpl).length
    ? anuncios.filter(a => a.cpl).reduce((s, a) => s + (a.cpl || 0), 0) / anuncios.filter(a => a.cpl).length
    : 0
  const totalInvestido = anuncios.reduce((s, a) => s + (a.valor_gasto || 0), 0)

  if (!loading && campanhas.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
          <BarChart2 size={28} className="text-text-secondary" />
        </div>
        <h2 className="text-text-primary font-semibold text-lg mb-2">Nenhuma campanha ainda</h2>
        <p className="text-text-secondary text-sm mb-6 max-w-xs">
          Faça upload de um CSV do Meta Ads para começar a analisar suas campanhas.
        </p>
        <button
          onClick={() => navigate('/upload')}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors"
        >
          Importar campanha
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="text-text-primary font-bold text-xl">
            {campanhaAtiva ? `Campanha: ${campanhaAtiva.nome}` : 'Dashboard'}
          </h1>
          {campanhas.length > 1 && (
            <select
              value={campanhaAtiva?.id || ''}
              onChange={e => {
                const c = campanhas.find(x => x.id === e.target.value)
                if (c) navigate(`/?campanha=${c.id}`)
              }}
              className="bg-bg border border-border rounded px-2 py-1 text-xs text-text-secondary focus:outline-none focus:border-primary"
            >
              {campanhas.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary border border-border rounded hover:border-primary/50 hover:text-text-primary transition-colors"
          >
            + Nova Campanha
          </button>
          {campanhaAtiva && (
            <button
              onClick={() => navigate(`/diagnostico/${campanhaAtiva.id}`)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded hover:bg-primary/90 transition-colors"
            >
              <RefreshCw size={14} />
              Diagnóstico da campanha
            </button>
          )}
        </div>
      </header>

      <div className="p-6 flex-1 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            icon={<Hash size={16} />}
            label="Total Ads"
            value={String(anuncios.length)}
            sub="anúncios ativos"
          />
          <MetricCard
            icon={<TrendingUp size={16} />}
            label="CTR Médio"
            value={`${(ctrMedio * 100).toFixed(1)}%`}
            sub="Benchmark: 1.5%"
          />
          <MetricCard
            icon={<DollarSign size={16} />}
            label="CPL Médio"
            value={`R$ ${cplMedio.toFixed(2)}`}
            sub="KPI Target: R$ 5,00"
          />
          <MetricCard
            icon={<BarChart2 size={16} />}
            label="Investido"
            value={`R$ ${totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            sub="Total da campanha"
          />
        </div>

        {anuncios.length > 0 && <GraficoCTR anuncios={anuncios} />}

        {anuncios.length > 0 && (
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-text-primary font-semibold text-base">Detailed Ad Breakdown</h2>
              <span className="text-text-secondary text-xs">Ver todos os anúncios →</span>
            </div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-4 py-2 text-xs font-medium text-text-secondary uppercase tracking-wider">
                <span>Ad Identity</span>
                <span>Status</span>
                <span>CTR</span>
                <span>CPL</span>
                <span>Actions</span>
              </div>
              {anuncios.map(a => <AnuncioCard key={a.id} anuncio={a} />)}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-text-secondary text-sm text-center py-12">Carregando...</div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, sub }: {
  icon: React.ReactNode; label: string; value: string; sub: string
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">{label}</span>
        <span className="text-text-secondary opacity-60">{icon}</span>
      </div>
      <div className="text-text-primary text-2xl font-bold">{value}</div>
      <div className="text-text-secondary text-xs mt-1">{sub}</div>
    </div>
  )
}
