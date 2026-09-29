import React from 'react'
import type { Building } from '../../types'
import { ActionMenu } from '../common/ActionMenu'

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
    <table className="w-full text-left text-xs text-slate-600">
      <thead className="bg-slate-50/80 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
        <tr>
          <th className="px-5 py-3">Code</th>
          <th className="px-5 py-3">Building Name</th>
          <th className="px-5 py-3">Address</th>
          <th className="px-5 py-3 text-center">Floors</th>
          {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {buildings.map((b) => (
          <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
            <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">
              {b.code}
            </td>
            <td className="px-5 py-3.5 font-semibold text-slate-900">{b.name}</td>
            <td className="px-5 py-3.5 text-slate-500 text-xs max-w-xs truncate">
              {b.address || '—'}
            </td>
            <td className="px-5 py-3.5 text-center">
              <button
                type="button"
                onClick={() => onViewFloors(b.id)}
                title={`View floors for ${b.name}`}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                {b.floor_count} floors
              </button>
            </td>
            {isAdmin && (
              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                <ActionMenu
                  primaryAction={{
                    label: 'Edit',
                    onClick: () => onEdit(b),
                  }}
                  items={[
                    {
                      label: 'Delete Building',
                      onClick: () => onDelete(b.id),
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

export default BuildingTable
