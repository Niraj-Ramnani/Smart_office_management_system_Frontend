import React from 'react'
import type { Role, UserManagement } from '../../types'

export interface UserTableProps {
  users: UserManagement[]
  roles: Role[]
  copiedId: number | null
  onCopyOid: (userId: number, oid: string) => void
  onRoleChange: (userId: number, newRole: string) => void
  onViewEmployee: (searchTerm: string) => void
  onOpenAssignModal: (user: UserManagement) => void
  onToggleActive: (userId: number, currentActive: boolean) => void
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  roles,
  copiedId,
  onCopyOid,
  onRoleChange,
  onViewEmployee,
  onOpenAssignModal,
  onToggleActive,
}) => {
  return (
    <table className="w-full text-left text-sm text-slate-600">
      <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
        <tr>
          <th className="px-6 py-3.5">User Email</th>
          <th className="px-6 py-3.5">Entra SSO ID (OID)</th>
          <th className="px-6 py-3.5">Application Role</th>
          <th className="px-6 py-3.5">Linked Employee</th>
          <th className="px-6 py-3.5 text-center">Status</th>
          <th className="px-6 py-3.5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50/75 transition-colors">
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-900">{u.email}</div>
              <div className="text-[11px] text-slate-400">ID: {u.id}</div>
            </td>
            <td className="px-6 py-4 font-mono text-xs">
              {u.sso_user_id ? (
                <button
                  type="button"
                  onClick={() => onCopyOid(u.id, u.sso_user_id!)}
                  title={`Full SSO OID: ${u.sso_user_id} (Click to copy)`}
                  className="group inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  <span>
                    {u.sso_user_id.length > 8
                      ? `${u.sso_user_id.slice(0, 8)}...`
                      : u.sso_user_id}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-600">
                    {copiedId === u.id ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              ) : (
                <span className="text-slate-400 italic">Not set</span>
              )}
            </td>
            <td className="px-6 py-4">
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
            <td className="px-6 py-4">
              {u.employee_name ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">
                      {u.employee_name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onViewEmployee(u.employee_code || u.employee_name || '')
                      }
                      title="View employee in directory"
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer whitespace-nowrap"
                    >
                      View employee →
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    ({u.employee_code})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">Unlinked</span>
              )}
            </td>
            <td className="px-6 py-4 text-center">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  u.is_active
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {u.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td className="px-6 py-4 text-right space-x-2">
              <button
                type="button"
                onClick={() => onOpenAssignModal(u)}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Link Employee
              </button>
              <button
                type="button"
                onClick={() => onToggleActive(u.id, u.is_active)}
                className="text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
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
