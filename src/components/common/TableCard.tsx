import React from 'react'

export interface TableCardProps {
  isLoading: boolean
  loadingMessage?: string
  error?: string | null
  isEmpty: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  children: React.ReactNode
}

export const TableCard: React.FC<TableCardProps> = ({
  isLoading,
  loadingMessage = 'Loading...',
  error,
  isEmpty,
  emptyTitle = 'No records found',
  emptyDescription,
  emptyAction,
  children,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {isLoading ? (
        <div className="p-12 text-center text-sm text-slate-500">{loadingMessage}</div>
      ) : error ? (
        <div className="p-8 text-center text-sm text-red-600">{error}</div>
      ) : isEmpty ? (
        <div className="p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-700">{emptyTitle}</p>
          {emptyDescription && (
            <p className="text-sm text-slate-500 max-w-sm mx-auto">{emptyDescription}</p>
          )}
          {emptyAction}
        </div>
      ) : (
        <div className="table-scroll">{children}</div>
      )}
    </div>
  )
}
