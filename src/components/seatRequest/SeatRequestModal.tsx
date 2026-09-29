import React, { useState, useEffect } from 'react'
import type { Employee, SeatRequestType, AssetType, Seat } from '../../types'
import { useCreateSeatRequestMutation } from '../../store/api/seatRequestApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'
import { useListSeatsQuery } from '../../store/api/seatApi'
import { useGetMeQuery } from '../../store/api/baseApi'

export interface InitialSeatInfo {
  id: number
  seat_number: string
  floor_id?: number
  status?: string
  employee_id?: number | null
  employee_name?: string | null
}

interface SeatRequestModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: SeatRequestType
  initialSeat?: InitialSeatInfo | null
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
    initialTargetEmployeeId || (initialSeat?.employee_id ?? '')
  )
  const [managedEmployeeId, setManagedEmployeeId] = useState<number | ''>('')
  const [preferredSeatId, setPreferredSeatId] = useState<number | ''>(
    initialSeat ? initialSeat.id : ''
  )
  const [assetType, setAssetType] = useState<AssetType>('Monitor')
  const [reason, setReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [showDeskPicker, setShowDeskPicker] = useState(false)
  const [showEmployeePicker, setShowEmployeePicker] = useState(false)

  const [createRequest, { isLoading }] = useCreateSeatRequestMutation()
  const { data: employeesData = [] } = useGetEmployeesQuery({ employee_status: 'ACTIVE' })
  const { data: seats = [] } = useListSeatsQuery()

  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setRequestType(initialType)
      }
      if (initialSeat) {
        setPreferredSeatId(initialSeat.id)
        setShowDeskPicker(false)
      } else {
        setShowDeskPicker(true)
      }
      if (initialTargetEmployeeId || initialSeat?.employee_id) {
        setTargetEmployeeId(initialTargetEmployeeId || initialSeat?.employee_id || '')
        setShowEmployeePicker(false)
      } else {
        setShowEmployeePicker(true)
      }
      setErrorMessage(null)
    }
  }, [isOpen, initialType, initialSeat, initialTargetEmployeeId])

  if (!isOpen) return null

  const selectedSeatObj =
    seats.find((s) => s.id === Number(preferredSeatId)) ||
    (initialSeat && initialSeat.id === Number(preferredSeatId) ? initialSeat : null)

  const selectedTargetEmployee =
    employeesData.find((e) => e.id === Number(targetEmployeeId)) ||
    (initialSeat?.employee_name && initialSeat?.employee_id === Number(targetEmployeeId)
      ? {
          id: initialSeat.employee_id,
          first_name: initialSeat.employee_name,
          last_name: '',
          employee_code: '',
          department: '',
        }
      : null)

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
    setShowDeskPicker(false)
    setShowEmployeePicker(false)
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
                onClick={() => setRequestType(initialType === 'NEW_SEAT' ? 'NEW_SEAT' : 'RELOCATION')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  requestType === 'RELOCATION' || requestType === 'NEW_SEAT'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {requestType === 'NEW_SEAT' ? 'New Seat' : 'Seat Relocation'}
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
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Target Desk {initialSeat ? '(Preselected)' : ''}
              </label>

              {selectedSeatObj && !showDeskPicker ? (
                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-between shadow-2xs animate-in fade-in duration-150">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
                      <span className="text-[9px] uppercase tracking-wider text-orange-200 font-medium">Desk</span>
                      <span className="text-xs leading-none font-black mt-0.5">{selectedSeatObj.seat_number}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          Desk {selectedSeatObj.seat_number}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            selectedSeatObj.status === 'Vacant'
                              ? 'bg-emerald-100 text-emerald-800'
                              : selectedSeatObj.status === 'Occupied'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {selectedSeatObj.status || 'Selected'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        Floor {selectedSeatObj.floor_id} · Selected directly from Seating Map
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeskPicker(true)}
                    className="shrink-0 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-white border border-orange-200 px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition cursor-pointer shadow-2xs"
                  >
                    Change Desk
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Choose from available workstations
                    </span>
                    {selectedSeatObj && (
                      <button
                        type="button"
                        onClick={() => setShowDeskPicker(false)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        Keep Desk {selectedSeatObj.seat_number}
                      </button>
                    )}
                  </div>
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
                </div>
              )}
            </div>
          )}

          {requestType === 'SWAP' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Employee to Swap Desks With {initialSeat?.employee_name ? '(Preselected)' : ''}
              </label>

              {selectedTargetEmployee && !showEmployeePicker ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between shadow-2xs animate-in fade-in duration-150">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
                      <span className="text-[9px] uppercase tracking-wider text-amber-200 font-medium">Swap</span>
                      <span className="text-xs leading-none font-bold mt-0.5">Desk</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {selectedTargetEmployee.first_name} {selectedTargetEmployee.last_name}
                        </span>
                        {selectedTargetEmployee.employee_code && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 font-mono">
                            {selectedTargetEmployee.employee_code}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {selectedTargetEmployee.department || 'Teammate'}
                        {initialSeat ? ` · Occupant of Desk ${initialSeat.seat_number}` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmployeePicker(true)}
                    className="shrink-0 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-white border border-amber-200 px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition cursor-pointer shadow-2xs"
                  >
                    Change Teammate
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Select teammate whose desk you wish to swap with
                    </span>
                    {selectedTargetEmployee && (
                      <button
                        type="button"
                        onClick={() => setShowEmployeePicker(false)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        Keep {selectedTargetEmployee.first_name}
                      </button>
                    )}
                  </div>
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
                <option value="Charger">Charger</option>
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
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
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
