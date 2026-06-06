import type { ReactNode } from 'react'

interface Props {
  icon?: ReactNode
  title: string
  content: string
  badge?: ReactNode
  className?: string
}

export function DiagnosticoBox({ icon, title, content, badge, className = '' }: Props) {
  return (
    <div className={`bg-surface border border-border rounded-lg p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-text-secondary">{icon}</span>}
          <h3 className="text-text-primary font-semibold text-sm">{title}</h3>
        </div>
        {badge}
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">{content}</p>
    </div>
  )
}
