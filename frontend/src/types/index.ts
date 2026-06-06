export type AdStatus = 'vencedor' | 'morto' | 'neutro'
export type ContextType = 'processo' | 'icp' | 'mercado' | 'outro'

export interface Contexto {
  id: string
  nome: string
  tipo: ContextType
  nicho: string | null
  conteudo: string
  criado_em: string
}

export interface Campanha {
  id: string
  nome: string
  contexto_id: string | null
  criado_em: string
}

export interface Anuncio {
  id: string
  campanha_id: string
  nome_anuncio: string
  impressoes: number | null
  cliques: number | null
  ctr: number | null
  cpl: number | null
  valor_gasto: number | null
  legenda: string | null
  texto_imagem: string | null
  texto_video: string | null
  status: AdStatus
  criado_em: string
}

export interface DiagnosticoCampanha {
  padrao_mortos: string
  padrao_vencedores: string
  o_que_legenda_revela: string
  acao_concreta: string
}

export interface DiagnosticoAnuncio {
  analise_hook: string
  analise_legenda: string
  veredicto: string
  acao_concreta: string
}

export interface Diagnostico {
  id: string
  anuncio_id: string | null
  campanha_id: string
  tipo: 'anuncio' | 'campanha'
  conteudo: DiagnosticoCampanha | DiagnosticoAnuncio
  criado_em: string
}

export interface CampanhaComMetricas extends Campanha {
  total_anuncios: number
  ctr_medio: number
  cpl_medio: number
  valor_total: number
  anuncios: Anuncio[]
}
