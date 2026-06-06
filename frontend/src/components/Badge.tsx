import type { AdStatus, ContextType } from '../types'

const statusStyles: Record<AdStatus, string> = {
  vencedor: 'bg-[#14532D] text-[#4ADE80]',
  morto: 'bg-[#450A0A] text-[#F87171]',
  neutro: 'bg-[#1C1917] text-[#A8A29E]',
}

const contextStyles: Record<ContextType, string> = {
  processo: 'bg-[#1E1B4B] text-[#818CF8]',
  icp: 'bg-[#0C4A6E] text-[#38BDF8]',
  mercado: 'bg-[#064E3B] text-[#34D399]',
  outro: 'bg-[#1C1917] text-[#A8A29E]',
}

interface BadgeProps {
  type: 'status' | 'context'
  value: AdStatus | ContextType
  className?: string
}

export function Badge({ type, value, className = '' }: BadgeProps) {
  const style = type === 'status'
    ? statusStyles[value as AdStatus]
    : contextStyles[value as ContextType]

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${style} ${className}`}>
      {value}
    </span>
  )
}
