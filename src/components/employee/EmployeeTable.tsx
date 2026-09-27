import React from 'react'
import type { Employee } from '../../types'
import { Badge } from '../common/Badge'
import { ActionMenu } from '../common/ActionMenu'

export interface EmployeeTableProps {
  employees: Employee[]
  isAdmin: boolean
  seatMap?: Record<number, string>
  onEdit: (emp: Employee) => void
  onToggleStatus: (emp: Employee) => void
  onDeactivate: (id: number) => void
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isAdmin,
  seatMap,
  onEdit,
  onToggleStatus,
  onDeactivate,
}) => {
  return (
    <table className="w-full text-left text-xs text-slate-600">
      <thead className="bg-slate-50/80 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
        <tr>
          <th className="px-5 py-3">Code</th>
          <th className="px-5 py-3">Employee</th>
          <th className="px-5 py-3">Seating Desk</th>
          <th className="px-5 py-3">Role & Dept</th>
          <th className="px-5 py-3">Team & Manager</th>
          <th className="px-5 py-3 text-center">Status</th>
          <th className="px-5 py-3 text-center">App Role</th>
          {isAdmin && <th className="px-5 py-3 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {employees.map((emp) => (
          <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
            <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">
              {emp.employee_code}
            </td>
            <td className="px-5 py-3.5">
              <div className="font-semibold text-slate-900">
                {emp.first_name} {emp.last_name}
              </div>
              <div className="text-[11px] text-slate-500">{emp.email}</div>
            </td>
            <td className="px-5 py-3.5">
              {seatMap && seatMap[emp.id] ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                  Desk {seatMap[emp.id]}
                </span>
              ) : (
                <span className="text-slate-400 text-xs italic">Unassigned</span>
              )}
            </td>
            <td className="px-5 py-3.5">
              <div className="font-medium text-slate-800">{emp.designation}</div>
              <div className="text-[11px] text-slate-500">
                {emp.department} · {emp.employment_type}
              </div>
            </td>
            <td className="px-5 py-3.5">
              <div className="font-medium text-slate-800">{emp.team_name || '—'}</div>
              <div className="text-[11px] text-slate-500">
                {emp.manager_name ? `Mgr: ${emp.manager_name}` : 'No manager'}
              </div>
            </td>
            <td className="px-5 py-3.5 text-center">
              <Badge status={emp.employee_status} showDot />
            </td>
            <td className="px-5 py-3.5 text-center">
              <Badge
                status={emp.role_name || 'Employee'}
                variant={
                  emp.role_name === 'Admin'
                    ? 'orange'
                    : emp.role_name === 'Manager'
                    ? 'neutral'
                    : 'inactive'
                }
              />
            </td>
            {isAdmin && (
              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                <ActionMenu
                  primaryAction={{
                    label: 'Edit',
                    onClick: () => onEdit(emp),
                  }}
                  items={[
                    {
                      label: emp.employee_status === 'ACTIVE' ? 'Deactivate' : 'Activate',
                      onClick: () => {
                        if (emp.employee_status === 'ACTIVE') {
                          onDeactivate(emp.id)
                        } else {
                          onToggleStatus(emp)
                        }
                      },
                      isDestructive: emp.employee_status === 'ACTIVE',
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

export default EmployeeTable
