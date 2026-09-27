import React from 'react'
import { Link } from 'react-router-dom'

export interface StatCardProps {
  to: string
  label: string
  linkLabel: string
  value: number | string
  subValue?: string
  description: string
  valueClassName?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  to,
  label,
  linkLabel,
  value,
  subValue,
  description,
  valueClassName = 'text-slate-900',
}) => {
  return (
    <Link
      to={to}
      className="group bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:border-orange-400/60 hover:shadow-md transition-all duration-200 block"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className="text-xs font-medium text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
          {linkLabel}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-3xl font-bold tracking-tight ${valueClassName}`}>
          {value}
        </span>
        {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
      </div>
      <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">{description}</p>
    </Link>
  )
}
