import React from 'react'
import type { Role, UserManagement } from '../../types'
import { Badge } from '../common/Badge'
import { ActionMenu } from '../common/ActionMenu'

export interface UserTableProps {
  users: UserManagement[]
  roles: Role[]
  onRoleChange: (userId: number, newRole: string) => void
  onViewEmployee: (searchTerm: string) => void
  onToggleActive: (userId: number, currentActive: boolean) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  roles,
  onRoleChange,
  onViewEmployee,
  onToggleActive,
}) => {
  return (
    <table className="w-full text-left text-xs text-slate-600">
      <thead className="bg-slate-50/80 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
        <tr>
          <th className="px-5 py-3">User Account</th>
          <th className="px-5 py-3">Linked Code</th>
          <th className="px-5 py-3">Application Role</th>
          <th className="px-5 py-3 text-center">Status</th>
          <th className="px-5 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
            <td className="px-5 py-3.5">
              <div className="font-semibold text-slate-900">
                {u.employee_name || u.email}
              </div>
              {u.employee_name && (
                <div className="text-[11px] text-slate-500">{u.email}</div>
              )}
            </td>
            <td className="px-5 py-3.5">
              {u.employee_code ? (
                <button
                  type="button"
                  onClick={() => onViewEmployee(u.employee_code || '')}
                  title="View in Employee Directory"
                  className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {u.employee_code}
                </button>
              ) : (
                <span className="text-slate-400 italic">—</span>
              )}
            </td>
            <td className="px-5 py-3.5">
              <select
                value={u.role_name}
                onChange={(e) => onRoleChange(u.id, e.target.value)}
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-5 py-3.5 text-center">
              <Badge status={u.is_active ? 'Active' : 'Inactive'} showDot />
            </td>
            <td className="px-5 py-3.5 text-right whitespace-nowrap">
              <ActionMenu
                items={[
                  {
                    label: u.is_active ? 'Deactivate Account' : 'Activate Account',
                    onClick: () => onToggleActive(u.id, u.is_active),
                    isDestructive: u.is_active,
                  },
                ]}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserTable
