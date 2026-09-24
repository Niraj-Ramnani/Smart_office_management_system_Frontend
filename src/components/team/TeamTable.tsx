import React from 'react'
import type { Team } from '../../types'

export interface TeamTableProps {
  teams: Team[]
  isAdmin: boolean
  onEdit: (team: Team) => void
  onDelete: (id: number) => void
}

export const TeamTable: React.FC<TeamTableProps> = ({
  teams,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="w-full text-left text-sm text-slate-600">
      <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
        <tr>
          <th className="px-6 py-3.5">Team Name</th>
          <th className="px-6 py-3.5">Department</th>
          <th className="px-6 py-3.5">Manager</th>
          <th className="px-6 py-3.5 text-center">Members</th>
          {isAdmin && <th className="px-6 py-3.5 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {teams.map((t) => (
          <tr key={t.id} className="hover:bg-slate-50/75 transition-colors">
            <td className="px-6 py-4 font-semibold text-slate-900">{t.name}</td>
            <td className="px-6 py-4 text-slate-600 font-medium">{t.department}</td>
            <td className="px-6 py-4">
              <div className="text-slate-900 font-medium">
                {t.manager_name || `Manager ID: ${t.manager_id}`}
              </div>
              {t.manager_email && (
                <div className="text-xs text-slate-400 font-mono">
                  {t.manager_email}
                </div>
              )}
            </td>
            <td className="px-6 py-4 text-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {t.member_count}
              </span>
            </td>
            {isAdmin && (
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(t)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
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
