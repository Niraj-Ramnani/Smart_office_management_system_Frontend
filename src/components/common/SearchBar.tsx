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
      <div className="w-full sm:w-72">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {children}
      {totalCount !== undefined && filteredCount !== undefined && (
        <div className="text-xs text-slate-500">
          Showing {filteredCount} of {totalCount} {itemLabel}
        </div>
      )}
    </div>
  )
}
