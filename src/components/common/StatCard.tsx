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
      className="group bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm hover:border-orange-400/60 hover:shadow-md transition-all duration-200 block"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <span className="text-[12px] font-semibold text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all duration-200">
          {linkLabel}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-4xl font-bold tracking-tight ${valueClassName}`}>
          {value}
        </span>
        {subValue && <span className="text-[13px] text-slate-500 font-medium">{subValue}</span>}
      </div>
      <p className="mt-2 text-[13px] text-slate-500 line-clamp-1">{description}</p>
    </Link>
  )
}
