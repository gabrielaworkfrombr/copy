import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { Upload } from './pages/Upload'
import { DiagnosticoCampanha } from './pages/DiagnosticoCampanha'
import { DiagnosticoAnuncio } from './pages/DiagnosticoAnuncio'
import { BancoDeAngulos } from './pages/BancoDeAngulos'
import { BaseDeContexto } from './pages/BaseDeContexto'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/diagnostico/:id" element={<DiagnosticoCampanha />} />
            <Route path="/anuncio/:id" element={<DiagnosticoAnuncio />} />
            <Route path="/banco-de-angulos" element={<BancoDeAngulos />} />
            <Route path="/base-de-contexto" element={<BaseDeContexto />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
