import React from 'react'
import type { Building } from '../../types'

export interface BuildingTableProps {
  buildings: Building[]
  isAdmin: boolean
  onEdit: (building: Building) => void
  onDelete: (id: number) => void
  onViewFloors: (buildingId: number) => void
}

export const BuildingTable: React.FC<BuildingTableProps> = ({
  buildings,
  isAdmin,
  onEdit,
  onDelete,
  onViewFloors,
}) => {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <th className="px-6 py-3">Code</th>
          <th className="px-6 py-3">Building Name</th>
          <th className="px-6 py-3">Address</th>
          <th className="px-6 py-3 text-center">Floors</th>
          {isAdmin && <th className="px-6 py-3 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm">
        {buildings.map((b) => (
          <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-6 py-4 font-mono font-medium text-blue-700 text-xs">
              {b.code}
            </td>
            <td className="px-6 py-4 font-semibold text-slate-800">{b.name}</td>
            <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
              {b.address || '—'}
            </td>
            <td className="px-6 py-4 text-center">
              <button
                type="button"
                onClick={() => onViewFloors(b.id)}
                title={`View floors for ${b.name}`}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 transition-colors cursor-pointer"
              >
                {b.floor_count}
              </button>
            </td>
            {isAdmin && (
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(b)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(b.id)}
                    className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
