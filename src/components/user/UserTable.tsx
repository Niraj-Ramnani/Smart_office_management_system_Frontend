import React from 'react'
import type { Role, UserManagement } from '../../types'

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
    <table className="w-full text-left text-sm text-slate-600">
      <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
        <tr>
          <th className="px-4 py-3.5">User / Employee</th>
          <th className="px-4 py-3.5">Employee Code</th>
          <th className="px-4 py-3.5">Application Role</th>
          <th className="px-4 py-3.5 text-center">Status</th>
          <th className="px-4 py-3.5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50/75 transition-colors">
            <td className="px-4 py-3.5">
              <div className="font-semibold text-slate-900">
                {u.employee_name || u.email}
              </div>
              {u.employee_name && (
                <div className="text-xs text-slate-500">{u.email}</div>
              )}
              <div className="text-[11px] text-slate-400 font-mono">
                {u.sso_user_id ? `OID: ${u.sso_user_id}` : 'OID: Pending first SSO login'}
              </div>
            </td>
            <td className="px-4 py-3.5">
              {u.employee_code ? (
                <button
                  type="button"
                  onClick={() => onViewEmployee(u.employee_code || '')}
                  title="View in Employee Directory"
                  className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded cursor-pointer transition-colors"
                >
                  {u.employee_code}
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">—</span>
              )}
            </td>
            <td className="px-4 py-3.5">
              <select
                value={u.role_name}
                onChange={(e) => onRoleChange(u.id, e.target.value)}
                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-4 py-3.5 text-center">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  u.is_active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {u.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-4 py-3.5 text-right whitespace-nowrap">
              <button
                type="button"
                onClick={() => onToggleActive(u.id, u.is_active)}
                className={`text-xs font-semibold cursor-pointer ${
                  u.is_active
                    ? 'text-rose-600 hover:text-rose-800'
                    : 'text-emerald-600 hover:text-emerald-800'
                }`}
              >
                {u.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
