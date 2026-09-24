import React from 'react'
import type { Employee, UserManagement } from '../../types'
import { Modal } from '../common'

export interface UserAssignModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserManagement | null
  employees: Employee[]
  selectedEmployeeId: number | null
  onEmployeeSelect: (id: number | null) => void
  onSave: () => void
  modalError: string | null
  isSubmitting: boolean
}

export const UserAssignModal: React.FC<UserAssignModalProps> = ({
  isOpen,
  onClose,
  user,
  employees,
  selectedEmployeeId,
  onEmployeeSelect,
  onSave,
  modalError,
  isSubmitting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Link User to Employee Record"
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600">
          Select the employee profile corresponding to{' '}
          <span className="font-semibold text-slate-900">
            {user?.email}
          </span>
          .
        </p>

        {modalError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {modalError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Employee Profile
          </label>
          <select
            value={selectedEmployeeId || ''}
            onChange={(e) =>
              onEmployeeSelect(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Unlink / No Employee —</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.first_name} {e.last_name} ({e.employee_code} - {e.department})
              </option>
            ))}
          </select>
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
            type="button"
            disabled={isSubmitting}
            onClick={onSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Save Link'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
