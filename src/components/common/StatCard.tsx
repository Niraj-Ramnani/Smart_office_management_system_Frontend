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
      className="group bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <span className="text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform">
          {linkLabel}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-3xl font-bold tracking-tight ${valueClassName}`}>
          {value}
        </span>
        {subValue && <span className="text-xs text-slate-500">{subValue}</span>}
      </div>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </Link>
  )
}
