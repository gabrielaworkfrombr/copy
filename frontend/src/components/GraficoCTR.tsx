import type { Anuncio } from '../types'

interface Props {
  anuncios: Anuncio[]
}

const statusColors: Record<string, string> = {
  vencedor: '#4ADE80',
  morto: '#F87171',
  neutro: '#A8A29E',
}

export function GraficoCTR({ anuncios }: Props) {
  if (!anuncios.length) return null

  const maxCtr = Math.max(...anuncios.map(a => a.ctr || 0))

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-primary font-semibold text-base">CTR por anúncio</h2>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />Vencedor</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />Morto</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#A8A29E]" />Neutro</span>
        </div>
      </div>
      <div className="space-y-3">
        {anuncios.map(anuncio => {
          const pct = maxCtr > 0 ? ((anuncio.ctr || 0) / maxCtr) * 100 : 0
          const color = statusColors[anuncio.status]
          return (
            <div key={anuncio.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-text-secondary text-xs truncate max-w-[200px]">{anuncio.nome_anuncio}</span>
                <span className="text-text-primary text-xs font-medium ml-2">
                  {anuncio.ctr != null ? `${(anuncio.ctr * 100).toFixed(1)}%` : '-'}
                </span>
              </div>
              <div className="h-2 bg-[#2A2A30] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
