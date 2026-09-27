import React from 'react'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  totalCount?: number
  filteredCount?: number
  itemLabel?: string
  children?: React.ReactNode
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  totalCount,
  filteredCount,
  itemLabel = 'items',
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="w-full sm:w-80">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />
      </div>
      {children}
      {totalCount !== undefined && filteredCount !== undefined && (
        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredCount}</span> of {totalCount} {itemLabel}
        </div>
      )}
    </div>
  )
}
