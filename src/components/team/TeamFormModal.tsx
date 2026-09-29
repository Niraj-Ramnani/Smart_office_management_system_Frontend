import React from 'react'
import type { Employee, Team } from '../../types'
import { Modal } from '../common'

export interface TeamFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingTeam: Team | null
  name: string
  setName: (val: string) => void
  department: string
  setDepartment: (val: string) => void
  managerId: number
  setManagerId: (val: number) => void
  employees: Employee[]
  formError: string | null
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const TeamFormModal: React.FC<TeamFormModalProps> = ({
  isOpen,
  onClose,
  editingTeam,
  name,
  setName,
  department,
  setDepartment,
  managerId,
  setManagerId,
  employees,
  formError,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTeam ? 'Edit Team' : 'Create Team'}
      maxWidth="md"
    >
      <div className="space-y-5">
        {formError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Team Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Frontend Platform"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Team Manager (Required) *
            </label>
            <select
              required
              value={managerId}
              onChange={(e) => setManagerId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={0} disabled>
                Select Manager
              </option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.first_name} {e.last_name} ({e.designation} - {e.employee_code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              A team must be led by an existing registered employee.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
              {isSubmitting ? 'Saving...' : editingTeam ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
