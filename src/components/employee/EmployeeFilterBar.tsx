import React from 'react'
import type { Team } from '../../types'

export interface EmployeeFilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedDepartment: string
  onDepartmentChange: (value: string) => void
  departments: string[]
  selectedTeamId?: number
  onTeamChange: (value?: number) => void
  teams: Team[]
  selectedStatus: string
  onStatusChange: (value: string) => void
}

export const EmployeeFilterBar: React.FC<EmployeeFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  selectedTeamId,
  onTeamChange,
  teams,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Name, code, designation, email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Team
          </label>
          <select
            value={selectedTeamId || ''}
            onChange={(e) =>
              onTeamChange(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  )
}
