import { useEffect, useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '../lib/api'
import type { Anuncio, DiagnosticoAnuncio } from '../types'
import { Badge } from '../components/Badge'

interface AnuncioComDiag extends Anuncio {
  campanha_nome?: string
  diagnostico?: DiagnosticoAnuncio
}

export function BancoDeAngulos() {
  const [anuncios, setAnuncios] = useState<AnuncioComDiag[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      api.getVencedores(search).then(setAnuncios).finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="flex-1 flex flex-col">
      <header className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-text-primary font-bold text-xl">Banco de Ângulos</h1>
            <p className="text-text-secondary text-sm mt-0.5">Anúncios vencedores salvos automaticamente.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por copy, nome..."
              className="bg-surface border border-border rounded pl-8 pr-3 py-2 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors w-64"
            />
          </div>
        </div>
      </header>

      <div className="p-6 flex-1">
        {loading && (
          <div className="text-text-secondary text-sm text-center py-16">Carregando...</div>
        )}

        {!loading && anuncios.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-base mb-2">Nenhum vencedor encontrado</p>
            <p className="text-text-secondary text-sm">
              {search ? `Nenhum resultado para "${search}"` : 'Faça upload de campanhas para começar.'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {anuncios.map(anuncio => (
            <div key={anuncio.id} className="bg-surface border border-border rounded-lg overflow-hidden">
              <button
                className="w-full text-left px-5 py-4 hover:bg-[#1F1F27] transition-colors"
                onClick={() => setExpanded(expanded === anuncio.id ? null : anuncio.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge type="status" value="vencedor" />
                    <div className="min-w-0">
                      <div className="text-text-primary font-semibold text-sm truncate">{anuncio.nome_anuncio}</div>
                      <div className="text-text-secondary text-xs truncate max-w-lg mt-0.5">
                        {anuncio.legenda?.slice(0, 100) || '—'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <div className="text-text-secondary text-xs">CTR</div>
                      <div className="text-[#4ADE80] font-bold text-sm">
                        {anuncio.ctr != null ? `${(anuncio.ctr * 100).toFixed(1)}%` : '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-text-secondary text-xs">CPL</div>
                      <div className="text-text-primary font-medium text-sm">
                        {anuncio.cpl != null ? `R$ ${anuncio.cpl.toFixed(2)}` : '—'}
                      </div>
                    </div>
                    {anuncio.campanha_nome && (
                      <div className="text-right hidden xl:block">
                        <div className="text-text-secondary text-xs">Campanha</div>
                        <div className="text-text-primary text-sm truncate max-w-[120px]">{anuncio.campanha_nome}</div>
                      </div>
                    )}
                    <div className="text-right hidden xl:block">
                      <div className="text-text-secondary text-xs">Data</div>
                      <div className="text-text-primary text-sm">
                        {new Date(anuncio.criado_em).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    {expanded === anuncio.id
                      ? <ChevronUp size={16} className="text-text-secondary" />
                      : <ChevronDown size={16} className="text-text-secondary" />
                    }
                  </div>
                </div>
              </button>

              {expanded === anuncio.id && (
                <div className="border-t border-border px-5 py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">Copy Completa</h4>
                      <div className="bg-bg rounded p-3 text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                        {[anuncio.legenda, anuncio.texto_imagem, anuncio.texto_video].filter(Boolean).join('\n\n') || '—'}
                      </div>
                    </div>

                    {anuncio.diagnostico ? (
                      <div className="space-y-3">
                        <h4 className="text-text-secondary text-xs font-medium uppercase tracking-wider">Diagnóstico Original</h4>
                        <div className="bg-bg rounded p-3 space-y-3">
                          <div>
                            <div className="text-text-secondary text-xs font-medium mb-1">Hook</div>
                            <p className="text-text-secondary text-xs leading-relaxed">{anuncio.diagnostico.analise_hook}</p>
                          </div>
                          <div>
                            <div className="text-text-secondary text-xs font-medium mb-1">Veredicto</div>
                            <p className="text-primary text-xs font-medium leading-relaxed">{anuncio.diagnostico.veredicto}</p>
                          </div>
                          <div>
                            <div className="text-text-secondary text-xs font-medium mb-1">Ação Concreta</div>
                            <p className="text-text-secondary text-xs leading-relaxed">{anuncio.diagnostico.acao_concreta}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-text-secondary text-sm">
                        Diagnóstico não gerado para este anúncio
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
