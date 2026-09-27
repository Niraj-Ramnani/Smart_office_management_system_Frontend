import React from 'react'
import type { Team } from '../../types'

export interface TeamTableProps {
  teams: Team[]
  isAdmin: boolean
  onOpenTeam: (team: Team) => void
  onEdit: (team: Team) => void
  onDelete: (id: number) => void
}

export const TeamTable: React.FC<TeamTableProps> = ({
  teams,
  isAdmin,
  onOpenTeam,
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
          <th className="px-6 py-3.5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {teams.map((t) => (
          <tr
            key={t.id}
            onClick={() => onOpenTeam(t)}
            className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
          >
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-900 group-hover:text-blue-600 flex items-center space-x-1.5 transition-colors">
                <span>{t.name}</span>
                <span className="text-[11px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  ↗
                </span>
              </div>
              <span className="text-xs text-slate-400">Click to view roster & manager</span>
            </td>
            <td className="px-6 py-4 text-slate-600 font-medium">{t.department}</td>
            <td className="px-6 py-4">
              <div className="text-slate-900 font-medium">
                {t.manager_name || `Manager ID: ${t.manager_id}`}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                {t.manager_email && (
                  <span className="font-mono">{t.manager_email}</span>
                )}
                {t.manager_designation && (
                  <span>• {t.manager_designation}</span>
                )}
                {t.manager_seat_number && (
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold text-[11px]">
                    Desk: {t.manager_seat_number}
                  </span>
                )}
              </div>
            </td>
            <td className="px-6 py-4 text-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {t.member_count} member{t.member_count === 1 ? '' : 's'}
              </span>
            </td>
            <td
              className="px-6 py-4 text-right space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onOpenTeam(t)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                Open Team
              </button>
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(t)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(t.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-800 px-2 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

