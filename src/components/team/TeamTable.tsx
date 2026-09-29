import React from 'react'
import type { Team } from '../../types'
import { Badge } from '../common/Badge'
import { ActionMenu } from '../common/ActionMenu'

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
    <table className="w-full text-left text-xs text-slate-600">
      <thead className="bg-slate-50/80 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
        <tr>
          <th className="px-5 py-3">Team Name</th>
          <th className="px-5 py-3">Department</th>
          <th className="px-5 py-3">Team Lead / Manager</th>
          <th className="px-5 py-3 text-center">Roster Size</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {teams.map((t) => (
          <tr
            key={t.id}
            onClick={() => onOpenTeam(t)}
            className="hover:bg-slate-50/70 cursor-pointer transition-colors"
          >
            <td className="px-5 py-3.5">
              <div className="font-semibold text-slate-900 hover:text-orange-600 transition-colors">
                {t.name}
              </div>
              <div className="text-[11px] text-slate-400">Click to view roster & seating</div>
            </td>
            <td className="px-5 py-3.5 font-medium text-slate-800">{t.department}</td>
            <td className="px-5 py-3.5">
              <div className="text-slate-900 font-medium">
                {t.manager_name || `Manager ID: ${t.manager_id}`}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                {t.manager_email && <span>{t.manager_email}</span>}
                {t.manager_seat_number && (
                  <span className="text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-medium text-[10px]">
                    Desk: {t.manager_seat_number}
                  </span>
                )}
              </div>
            </td>
            <td className="px-5 py-3.5 text-center">
              <Badge variant="neutral">
                {t.member_count} member{t.member_count === 1 ? '' : 's'}
              </Badge>
            </td>
            <td
              className="px-5 py-3.5 text-right whitespace-nowrap"
              onClick={(e) => e.stopPropagation()}
            >
              <ActionMenu
                primaryAction={{
                  label: 'View',
                  onClick: () => onOpenTeam(t),
                }}
                items={
                  isAdmin
                    ? [
                        {
                          label: 'Edit Team',
                          onClick: () => onEdit(t),
                        },
                        {
                          label: 'Delete Team',
                          onClick: () => onDelete(t.id),
                          isDestructive: true,
                        },
                      ]
                    : []
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TeamTable
