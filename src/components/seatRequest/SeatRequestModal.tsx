import React, { useState, useEffect } from 'react'
import type { Employee, SeatRequestType, AssetType, Seat } from '../../types'
import { useCreateSeatRequestMutation } from '../../store/api/seatRequestApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'
import { useListSeatsQuery } from '../../store/api/seatApi'
import { useGetMeQuery } from '../../store/api/baseApi'

interface SeatRequestModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: SeatRequestType
  initialSeat?: { id: number; seat_number: string } | null
  initialTargetEmployeeId?: number | null
}

export const SeatRequestModal: React.FC<SeatRequestModalProps> = ({
  isOpen,
  onClose,
  initialType = 'RELOCATION',
  initialSeat = null,
  initialTargetEmployeeId = null,
}) => {
  const { data: currentUser } = useGetMeQuery()
  const isManagerOrAdmin = currentUser?.role === 'Manager' || currentUser?.role === 'Admin'

  const [requestType, setRequestType] = useState<SeatRequestType>(initialType)
  const [targetEmployeeId, setTargetEmployeeId] = useState<number | ''>(
    initialTargetEmployeeId || ''
  )
  const [managedEmployeeId, setManagedEmployeeId] = useState<number | ''>('')
  const [preferredSeatId, setPreferredSeatId] = useState<number | ''>(
    initialSeat ? initialSeat.id : ''
  )
  const [assetType, setAssetType] = useState<AssetType>('Monitor')
  const [reason, setReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [createRequest, { isLoading }] = useCreateSeatRequestMutation()
  const { data: employeesData = [] } = useGetEmployeesQuery({ employee_status: 'ACTIVE' })
  const { data: seats = [] } = useListSeatsQuery()

  // Sync props into state whenever the modal is opened with new values
  useEffect(() => {
    if (isOpen) {
      setRequestType(initialType)
      setPreferredSeatId(initialSeat ? initialSeat.id : '')
      setTargetEmployeeId(initialTargetEmployeeId || '')
      setManagedEmployeeId('')
      setReason('')
      setErrorMessage(null)
    }
  }, [isOpen, initialType, initialSeat, initialTargetEmployeeId])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      await createRequest({
        request_type: requestType,
        target_seat_id: preferredSeatId ? Number(preferredSeatId) : undefined,
        preferred_seat_id: preferredSeatId ? Number(preferredSeatId) : undefined,
        target_employee_id: targetEmployeeId ? Number(targetEmployeeId) : undefined,
        employee_id: isManagerOrAdmin && managedEmployeeId ? Number(managedEmployeeId) : undefined,
        asset_type: requestType === 'ASSET_NEW' ? assetType : undefined,
        reason: reason.trim() || undefined,
      }).unwrap()

      handleClose()
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Failed to submit seat request')
    }
  }

  const handleClose = () => {
    setReason('')
    setPreferredSeatId('')
    setTargetEmployeeId('')
    setManagedEmployeeId('')
    setErrorMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-base font-bold text-slate-800">
              {isManagerOrAdmin ? 'Initiate Seat / Asset Request' : 'Submit Workspace Request'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Request Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRequestType('RELOCATION')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  requestType === 'RELOCATION' || requestType === 'NEW_SEAT'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Seat Relocation
              </button>
              <button
                type="button"
                onClick={() => setRequestType('SWAP')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  requestType === 'SWAP'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Seat Swap
              </button>
              <button
                type="button"
                onClick={() => setRequestType('ASSET_NEW')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  requestType === 'ASSET_NEW'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                New Asset
              </button>
            </div>
          </div>

          {isManagerOrAdmin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Team Member (Optional: Leave blank for yourself)
              </label>
              <select
                value={managedEmployeeId}
                onChange={(e) => setManagedEmployeeId(Number(e.target.value) || '')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">-- Apply for myself / Default --</option>
                {employeesData.map((emp: Employee) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_code} - {emp.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(requestType === 'RELOCATION' || requestType === 'NEW_SEAT') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Desk
              </label>

              {/* Show pre-selected seat badge when coming from floor map click */}
              {initialSeat && preferredSeatId === initialSeat.id ? (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-800">
                    Pre-selected: Desk {initialSeat.seat_number}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreferredSeatId('')}
                    className="ml-auto text-[10px] text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <select
                  value={preferredSeatId}
                  onChange={(e) => setPreferredSeatId(Number(e.target.value) || '')}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">-- Select destination desk --</option>
                  {seats.map((seat: Seat) => (
                    <option key={seat.id} value={seat.id}>
                      {seat.seat_number} · Floor {seat.floor_id} ({seat.status}
                      {seat.employee_name ? ` - Occupied by ${seat.employee_name}` : ''})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {requestType === 'SWAP' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Employee to Swap Desks With
              </label>
              <select
                value={targetEmployeeId}
                onChange={(e) => setTargetEmployeeId(Number(e.target.value) || '')}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">-- Choose employee to swap --</option>
                {employeesData.map((emp: Employee) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_code} - {emp.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {requestType === 'ASSET_NEW' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Asset Category
              </label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="Monitor">Monitor</option>
                <option value="Mouse">Mouse</option>
                <option value="Earphone">Earphone</option>
                <option value="Desktop">Desktop</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Reason / Business Justification
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the justification for this request..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SeatRequestModal
