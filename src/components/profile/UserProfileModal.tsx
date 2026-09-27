import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { useGetMeQuery } from '../../store/api/baseApi'
import { useGetEmployeeByIdQuery } from '../../store/api/employeeApi'
import { useListSeatsQuery } from '../../store/api/seatApi'
import { useGetMyAssetsQuery } from '../../store/api/assetApi'
import type { Seat } from '../../types'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const authUser = useSelector((state: RootState) => state.auth.user)
  const { data: currentUser } = useGetMeQuery()
  const effectiveUser = currentUser || authUser

  const employeeId = effectiveUser?.employee_id || 0
  const { data: employee } = useGetEmployeeByIdQuery(employeeId, {
    skip: !employeeId,
  })

  const { data: allSeats = [] } = useListSeatsQuery()
  const { data: myAssets = [] } = useGetMyAssetsQuery(undefined, {
    skip: !effectiveUser,
  })

  const assignedSeat = allSeats.find((s: Seat) => s.employee_id === employeeId)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getDisplayName = () => {
    if (employee) return `${employee.first_name} ${employee.last_name}`
    if (effectiveUser?.role === 'Admin') return 'InTimeTec Admin'
    if (!effectiveUser?.email) return 'User'
    const local = effectiveUser.email.split('@')[0]
    const words = local.replace(/[0-9]+/g, '').split(/[._-]/).filter(Boolean)
    if (words.length > 0) {
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    }
    return local
  }

  const fullName = getDisplayName()
  const initials =
    fullName
      .split(' ')
      .map((w) => w[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || 'U'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        <div className="bg-zinc-950 px-6 py-5 border-b border-zinc-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-lg bg-zinc-800 border-2 border-orange-500/80 text-white font-bold text-base flex items-center justify-center shadow-inner">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {fullName}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-orange-600/20 text-orange-400 border border-orange-500/30">
                  {effectiveUser?.role || 'User'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {effectiveUser?.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800 cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Employee Code
              </div>
              <div className="text-xs font-mono font-semibold text-slate-800 mt-1">
                {employee?.employee_code || (effectiveUser?.role === 'Admin' ? 'ADMIN-01' : 'Unassigned')}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Account Status
              </div>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-800">
                  {effectiveUser?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Department
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1">
                {employee?.department || (effectiveUser?.role === 'Admin' ? 'IT Infrastructure' : 'General')}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Designation
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1">
                {employee?.designation || (effectiveUser?.role === 'Admin' ? 'System Administrator' : 'Associate')}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-700 tracking-wider border-b border-slate-100 pb-1.5">
              Team & Hierarchy
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Assigned Team</span>
                <span className="font-semibold text-slate-800">
                  {employee?.team_name || (effectiveUser?.role === 'Admin' ? 'Global IT Admin' : 'Unassigned')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Reporting Manager</span>
                <span className="font-semibold text-slate-800">
                  {employee?.manager_name || (effectiveUser?.role === 'Admin' ? 'Executive IT Head' : 'None / Direct')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-700 tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
              <span>Seating & Desk</span>
              {assignedSeat && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  Assigned
                </span>
              )}
            </div>

            {assignedSeat ? (
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Desk Number</span>
                  <span className="font-mono font-bold text-orange-600 text-sm">
                    {assignedSeat.seat_number}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Floor</span>
                  <span className="font-semibold text-slate-800">
                    {assignedSeat.floor_name || `Floor ${assignedSeat.floor_number || 1}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Building</span>
                  <span className="font-semibold text-slate-800">
                    {assignedSeat.building_name || 'Main Office'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-1">
                No permanent desk assigned. You can request desk allocation from the Seating Map or Requests page.
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="text-[11px] uppercase font-bold text-slate-700 tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
              <span>Allocated IT Assets</span>
              <span className="text-[11px] font-semibold text-slate-500">
                {myAssets.length} {myAssets.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {myAssets.length > 0 ? (
              <div className="space-y-2">
                {myAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-md text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">
                        {asset.name || asset.model_name || asset.asset_type}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Type: {asset.asset_type} {asset.serial_number ? `· S/N: ${asset.serial_number}` : ''}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {asset.asset_code}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-1">
                No hardware equipment currently allocated.
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfileModal
