import React from 'react'
import type { Floor } from '../../types'

export interface FloorTableProps {
  floors: Floor[]
  isAdmin: boolean
  onEdit: (floor: Floor) => void
  onDelete: (id: number) => void
}

export const FloorTable: React.FC<FloorTableProps> = ({
  floors,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="w-full text-left text-sm text-slate-600">
      <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
        <tr>
          <th className="px-6 py-3.5">Building</th>
          <th className="px-6 py-3.5">Floor Level</th>
          <th className="px-6 py-3.5">Name</th>
          <th className="px-6 py-3.5">Map Size</th>
          <th className="px-6 py-3.5 text-center">Seats</th>
          {isAdmin && <th className="px-6 py-3.5 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {floors.map((f) => (
          <tr key={f.id} className="hover:bg-slate-50/75 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-900">
              {f.building_name || `Building #${f.building_id}`}
            </td>
            <td className="px-6 py-4 font-mono font-semibold text-slate-700">
              Level {f.floor_number}
            </td>
            <td className="px-6 py-4 font-medium text-slate-800">
              {f.name}
            </td>
            <td className="px-6 py-4 text-xs font-mono text-slate-500">
              {f.map_width} × {f.map_height} px
            </td>
            <td className="px-6 py-4 text-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {f.seat_count}
              </span>
            </td>
            {isAdmin && (
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(f)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(f.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-800 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
