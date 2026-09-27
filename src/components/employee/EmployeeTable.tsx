import React from 'react'
import type { Employee } from '../../types'

export interface EmployeeTableProps {
  employees: Employee[]
  isAdmin: boolean
  onEdit: (emp: Employee) => void
  onToggleStatus: (emp: Employee) => void
  onDeactivate: (id: number) => void
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isAdmin,
  onEdit,
  onToggleStatus,
  onDeactivate,
}) => {

  return (
    <table className="w-full text-left text-sm text-slate-600">
      <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
        <tr>
          <th className="px-5 py-3.5">Code</th>
          <th className="px-5 py-3.5">Employee</th>
          <th className="px-5 py-3.5">Designation & Dept</th>
          <th className="px-5 py-3.5">Team & Manager</th>
          <th className="px-5 py-3.5 text-center">Status</th>
          <th className="px-5 py-3.5 text-center">App Role</th>
          {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {employees.map((emp) => (
          <tr key={emp.id} className="hover:bg-slate-50/75 transition-colors">
            <td className="px-5 py-4 font-mono font-medium text-slate-900 text-xs">
              {emp.employee_code}
            </td>
            <td className="px-5 py-4">
              <div className="font-semibold text-slate-900">
                {emp.first_name} {emp.last_name}
              </div>
              <div className="text-xs text-slate-400 font-mono">{emp.email}</div>
              {emp.phone && (
                <div className="text-[11px] text-slate-500">{emp.phone}</div>
              )}
            </td>
            <td className="px-5 py-4">
              <div className="font-medium text-slate-800">{emp.designation}</div>
              <div className="text-xs text-slate-500">
                {emp.department} • {emp.employment_type}
              </div>
            </td>
            <td className="px-5 py-4 text-xs">
              <div>
                <span className="font-medium text-slate-700">Team: </span>
                {emp.team_name || '—'}
              </div>
              <div className="text-slate-500 mt-0.5">
                <span className="font-medium text-slate-700">Manager: </span>
                {emp.manager_name || '—'}
              </div>
            </td>
            <td className="px-5 py-4 text-center">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  emp.employee_status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {emp.employee_status}
              </span>
            </td>
            <td className="px-5 py-4 text-center">
              {emp.role_name ? (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    emp.role_name === 'Admin'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : emp.role_name === 'Manager'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {emp.role_name}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Employee
                </span>
              )}
            </td>
            {isAdmin && (
              <td className="px-5 py-4 text-right space-x-2">
                <button
                  type="button"
                  onClick={() => onEdit(emp)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (emp.employee_status === 'ACTIVE') {
                      onDeactivate(emp.id)
                    } else {
                      onToggleStatus(emp)
                    }
                  }}
                  className={`text-xs font-medium cursor-pointer ${
                    emp.employee_status === 'ACTIVE'
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {emp.employee_status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
