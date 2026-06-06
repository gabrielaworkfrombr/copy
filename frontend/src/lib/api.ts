const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Erro na requisição')
  }
  return res.json()
}

export const api = {
  // Contextos
  getContextos: () => request<any[]>('/contextos'),
  uploadContexto: (form: FormData) =>
    fetch(`${BASE_URL}/contextos`, { method: 'POST', body: form }).then(r => {
      if (!r.ok) return r.json().then(e => Promise.reject(new Error(e.detail)))
      return r.json()
    }),
  deleteContexto: (id: string) => request(`/contextos/${id}`, { method: 'DELETE' }),

  // Campanhas
  getCampanhas: () => request<any[]>('/campanhas'),
  getCampanha: (id: string) => request<any>(`/campanhas/${id}`),
  uploadCampanha: (form: FormData) =>
    fetch(`${BASE_URL}/upload`, { method: 'POST', body: form }).then(r => {
      if (!r.ok) return r.json().then(e => Promise.reject(new Error(e.detail)))
      return r.json()
    }),

  // Anúncios
  getAnuncios: (campanhaId: string) => request<any[]>(`/campanhas/${campanhaId}/anuncios`),
  getAnuncio: (id: string) => request<any>(`/anuncios/${id}`),

  // Diagnósticos
  getDiagnosticoCampanha: (campanhaId: string) =>
    request<any>(`/diagnostico/campanha/${campanhaId}`),
  gerarDiagnosticoCampanha: (campanhaId: string) =>
    request<any>(`/diagnostico/campanha/${campanhaId}/gerar`, { method: 'POST' }),
  getDiagnosticoAnuncio: (anuncioId: string) =>
    request<any>(`/diagnostico/anuncio/${anuncioId}`),
  gerarDiagnosticoAnuncio: (anuncioId: string) =>
    request<any>(`/diagnostico/anuncio/${anuncioId}/gerar`, { method: 'POST' }),

  // Banco de Ângulos
  getVencedores: (search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : ''
    return request<any[]>(`/banco-de-angulos${qs}`)
  },
}
