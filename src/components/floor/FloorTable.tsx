import React from 'react'
import type { Floor } from '../../types'
import { ActionMenu } from '../common/ActionMenu'

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
    <table className="w-full text-left text-xs text-slate-600">
      <thead className="bg-slate-50/80 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
        <tr>
          <th className="px-5 py-3">Building</th>
          <th className="px-5 py-3">Floor Level</th>
          <th className="px-5 py-3">Name</th>
          <th className="px-5 py-3 text-center">Seats</th>
          {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {floors.map((f) => (
          <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
            <td className="px-5 py-3.5 font-medium text-slate-900">
              {f.building_name || `Building #${f.building_id}`}
            </td>
            <td className="px-5 py-3.5 font-mono font-semibold text-slate-700">
              Level {f.floor_number}
            </td>
            <td className="px-5 py-3.5 font-medium text-slate-800">
              {f.name}
            </td>
            <td className="px-5 py-3.5 text-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {f.seat_count} seats
              </span>
            </td>
            {isAdmin && (
              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                <ActionMenu
                  primaryAction={{
                    label: 'Edit',
                    onClick: () => onEdit(f),
                  }}
                  items={[
                    {
                      label: 'Delete Floor',
                      onClick: () => onDelete(f.id),
                      isDestructive: true,
                    },
                  ]}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FloorTable
