import { useNavigate } from 'react-router-dom'
import type { Anuncio } from '../types'
import { Badge } from './Badge'

interface Props {
  anuncio: Anuncio
}

export function AnuncioCard({ anuncio }: Props) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-[#1F1F27] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded bg-[#2A2A30] flex-shrink-0 flex items-center justify-center">
          <span className="text-text-secondary text-xs font-bold">
            {anuncio.nome_anuncio.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <div className="text-text-primary text-sm font-medium truncate">{anuncio.nome_anuncio}</div>
          <div className="text-text-secondary text-xs truncate">
            {anuncio.legenda?.slice(0, 60) ?? '—'}
          </div>
        </div>
      </div>

      <Badge type="status" value={anuncio.status} />

      <div className="text-text-primary text-sm font-medium">
        {anuncio.ctr != null ? `${(anuncio.ctr * 100).toFixed(1)}%` : '—'}
      </div>

      <div className="text-text-primary text-sm font-medium">
        {anuncio.cpl != null ? `R$ ${anuncio.cpl.toFixed(2)}` : '—'}
      </div>

      <button
        onClick={() => navigate(`/anuncio/${anuncio.id}`)}
        className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded hover:bg-primary/10 transition-colors whitespace-nowrap"
      >
        Ver diagnóstico
      </button>
    </div>
  )
}
