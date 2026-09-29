import React from 'react'

export interface PageHeaderProps {
  title: string
  subtitle: string
  action?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-1">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900 leading-tight">{title}</h1>
        <p className="text-[13.5px] text-slate-500 mt-1 leading-snug">{subtitle}</p>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
