import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Bookmark, FileText, Upload, Settings, HelpCircle, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface Campanha {
  id: string
  nome: string
  criado_em: string
}

export function Sidebar() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    api.getCampanhas().then(setCampanhas).catch(() => {})
  }, [])

  return (
    <aside className="w-56 min-h-screen bg-surface border-r border-border flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <div className="text-text-primary font-semibold text-sm leading-tight">CopyEngine</div>
            <div className="text-text-secondary text-xs">Copy Analysis</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavItem to="/" icon={<LayoutDashboard size={16} />} label="Dashboard" />
        <NavItem to="/banco-de-angulos" icon={<Bookmark size={16} />} label="Banco de Ângulos" />
        <NavItem to="/base-de-contexto" icon={<FileText size={16} />} label="Base de Contexto" />

        {campanhas.length > 0 && (
          <div className="pt-4">
            <div className="text-text-secondary text-xs font-medium uppercase tracking-wider px-2 mb-2">
              Campanhas Ativas
            </div>
            <div className="space-y-0.5">
              {campanhas.slice(0, 5).map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/?campanha=${c.id}`)}
                  className="w-full text-left px-2 py-1.5 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-[#2A2A30] transition-colors truncate"
                >
                  {c.nome}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <NavItem to="/upload" icon={<Upload size={16} />} label="Nova Campanha" />
        <NavItem to="/settings" icon={<Settings size={16} />} label="Settings" />
        <NavItem to="/support" icon={<HelpCircle size={16} />} label="Support" />
        <div className="flex items-center gap-2 px-2 py-2 mt-2 rounded bg-[#2A2A30]">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
            MA
          </div>
          <div className="min-w-0">
            <div className="text-text-primary text-xs font-medium truncate">Meta Ads Expert</div>
            <div className="text-text-secondary text-xs truncate">Expert Analytics</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2 py-2 rounded text-sm transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-[#2A2A30]'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}
