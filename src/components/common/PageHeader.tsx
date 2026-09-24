import React from 'react'

export interface PageHeaderProps {
  title: string
  subtitle: string
  action?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
