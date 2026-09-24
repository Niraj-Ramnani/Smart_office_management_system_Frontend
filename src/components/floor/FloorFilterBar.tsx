import React from 'react'
import type { Building } from '../../types'

export interface FloorFilterBarProps {
  selectedBuildingId?: number
  onBuildingChange: (value?: number) => void
  buildings: Building[]
  floorCount: number
}

export const FloorFilterBar: React.FC<FloorFilterBarProps> = ({
  selectedBuildingId,
  onBuildingChange,
  buildings,
  floorCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
          Filter by Building:
        </label>
        <select
          value={selectedBuildingId || ''}
          onChange={(e) =>
            onBuildingChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        >
          <option value="">All Buildings</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.code})
            </option>
          ))}
        </select>
      </div>
      <div className="text-xs text-slate-500">
        Showing {floorCount} floors
      </div>
    </div>
  )
}
