import React, { useState } from 'react'
import type { Employee, Role } from '../../types'
import { Modal } from '../common'

export interface UserProvisionModalProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  roles: Role[]
  onSubmit: (payload: {
    employee_id: number
    sso_user_id: string
    role_name: string
    email?: string
  }) => Promise<void>
  isSubmitting: boolean
  error: string | null
}

export const UserProvisionModal: React.FC<UserProvisionModalProps> = ({
  isOpen,
  onClose,
  employees,
  roles,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0)
  const [ssoUserId, setSsoUserId] = useState('')
  const [roleName, setRoleName] = useState('Employee')

  const effectiveEmployeeId =
    selectedEmployeeId || employees.find((e) => !e.is_user_linked)?.id || 0

  const selectedEmployee = employees.find((e) => e.id === effectiveEmployeeId)

  const handleClose = () => {
    setSelectedEmployeeId(0)
    setSsoUserId('')
    setRoleName('Employee')
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!effectiveEmployeeId || !ssoUserId.trim()) return

    await onSubmit({
      employee_id: effectiveEmployeeId,
      sso_user_id: ssoUserId.trim(),
      role_name: roleName,
      email: selectedEmployee?.email,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Provision Application User"
      subtitle="Register an employee for Microsoft Entra SSO and assign their system access role."
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Employee Profile *
            </label>
            <select
              required
              value={effectiveEmployeeId || ''}
              onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Employee
              </option>
              {employees.map((e) => (
                <option
                  key={e.id}
                  value={e.id}
                  disabled={e.is_user_linked}
                >
                  {e.first_name} {e.last_name} ({e.employee_code} - {e.department})
                  {e.is_user_linked ? ' [Already Linked]' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Employee Email
            </label>
            <input
              type="text"
              readOnly
              value={selectedEmployee?.email || ''}
              placeholder="Select an employee above"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-mono text-xs cursor-not-allowed focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Microsoft Entra Object ID (OID) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 8c17f5d5-1234-4567-890a-bcdef0123456"
              value={ssoUserId}
              onChange={(e) => setSsoUserId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              The unique Object ID from your Azure / Microsoft Entra ID tenant.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Application Role *
            </label>
            <select
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.length > 0 ? (
                roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </>
              )}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !effectiveEmployeeId || !ssoUserId.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Provisioning...' : 'Provision User'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
