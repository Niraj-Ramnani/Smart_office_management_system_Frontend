import React from 'react'
import type { Employee, Team } from '../../types'
import { Modal } from '../common'

export interface EmployeeFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingEmployee: Employee | null
  formError: string | null
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  employeeCode: string
  setEmployeeCode: (val: string) => void
  employmentType: string
  setEmploymentType: (val: string) => void
  firstName: string
  setFirstName: (val: string) => void
  lastName: string
  setLastName: (val: string) => void
  email: string
  setEmail: (val: string) => void
  phone: string
  setPhone: (val: string) => void
  designation: string
  setDesignation: (val: string) => void
  department: string
  setDepartment: (val: string) => void
  teamId?: number
  setTeamId: (val?: number) => void
  teams: Team[]
  managerId?: number
  setManagerId: (val?: number) => void
  employees: Employee[]
  employeeStatus: string
  setEmployeeStatus: (val: string) => void
  roleName: string
  setRoleName: (val: string) => void
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  editingEmployee,
  formError,
  isSubmitting,
  onSubmit,
  employeeCode,
  setEmployeeCode,
  employmentType,
  setEmploymentType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  designation,
  setDesignation,
  department,
  setDepartment,
  teamId,
  setTeamId,
  teams,
  managerId,
  setManagerId,
  employees,
  employeeStatus,
  setEmployeeStatus,
  roleName,
  setRoleName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEmployee ? 'Edit Employee Record' : 'Onboard New Employee'}
      subtitle={
        editingEmployee
          ? 'Update organizational details and permissions'
          : 'Create employee and configure application access in a single step'
      }
      maxWidth="lg"
    >
      <div className="space-y-4">
        {formError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employee Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. EMP-001"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employment Type *
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Email (Microsoft Entra ID) *
              </label>
              <input
                type="email"
                required
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Matches their Microsoft Entra sign-in.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Access Role *
              </label>
              <select
                required
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Employee">Employee (Desk Requests)</option>
                <option value="Manager">Manager (Team Approvals)</option>
                <option value="Admin">Admin (Full System Operations)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Application authorization role.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={employeeStatus}
                onChange={(e) => setEmployeeStatus(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Software Engineer"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Team (Optional)
              </label>
              <select
                value={teamId || ''}
                onChange={(e) =>
                  setTeamId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">No Team Assigned</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reporting Manager (Optional)
              </label>
              <select
                value={managerId || ''}
                onChange={(e) =>
                  setManagerId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">No Direct Manager</option>
                {employees
                  .filter((e) => !editingEmployee || e.id !== editingEmployee.id)
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.first_name} {e.last_name} ({e.designation})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : editingEmployee ? 'Update Profile' : 'Onboard Employee'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
