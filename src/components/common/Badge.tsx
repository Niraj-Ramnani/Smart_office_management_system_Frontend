import React from 'react'

export type BadgeVariant =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'blocked'
  | 'neutral'
  | 'orange'

export interface BadgeProps {
  status?: string | null
  variant?: BadgeVariant
  children?: React.ReactNode
  showDot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  showDot = false,
  className = '',
}) => {
  const resolveVariant = (): BadgeVariant => {
    if (variant) return variant
    const s = (status || '').toUpperCase()

    if (['ACTIVE', 'APPROVED', 'COMPLETED', 'AVAILABLE'].includes(s)) {
      return 'active'
    }
    if (['PENDING', 'PENDING_CONSENT', 'UNDER MAINTENANCE'].includes(s)) {
      return 'pending'
    }
    if (['REJECTED', 'CANCELLED', 'FAILED'].includes(s)) {
      return 'rejected'
    }
    if (['INACTIVE', 'RETIRED', 'VACANT'].includes(s)) {
      return 'inactive'
    }
    if (['BLOCKED', 'OCCUPIED', 'ASSIGNED'].includes(s)) {
      return 'blocked'
    }
    return 'neutral'
  }

  const v = resolveVariant()

  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    active: {
      container: 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
      dot: 'bg-emerald-500',
    },
    approved: {
      container: 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
      dot: 'bg-emerald-500',
    },
    pending: {
      container: 'bg-amber-50 text-amber-800 border-amber-200/70',
      dot: 'bg-amber-500',
    },
    rejected: {
      container: 'bg-rose-50 text-rose-800 border-rose-200/70',
      dot: 'bg-rose-500',
    },
    inactive: {
      container: 'bg-slate-100 text-slate-600 border-slate-200/70',
      dot: 'bg-slate-400',
    },
    blocked: {
      container: 'bg-slate-100 text-slate-800 border-slate-200/70',
      dot: 'bg-slate-700',
    },
    orange: {
      container: 'bg-orange-50 text-orange-800 border-orange-200/70',
      dot: 'bg-orange-500',
    },
    neutral: {
      container: 'bg-slate-100 text-slate-700 border-slate-200/70',
      dot: 'bg-slate-400',
    },
  }

  const style = variantStyles[v]
  const content = children || status || ''

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${style.container} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />}
      <span>{content}</span>
    </span>
  )
}
