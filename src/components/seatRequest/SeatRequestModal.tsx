import React, { useState } from 'react'
import type { Employee, SeatRequestType } from '../../types'
import { useCreateSeatRequestMutation } from '../../store/api/seatRequestApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'

interface SeatRequestModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: SeatRequestType
  initialSeat?: { id: number; seat_number: string } | null
  initialTargetEmployeeId?: number | null
}

interface SeatRequestFormContentProps {
  onClose: () => void
  initialType: SeatRequestType
  initialSeat: { id: number; seat_number: string } | null
  initialTargetEmployeeId: number | null
}

const SeatRequestFormContent: React.FC<SeatRequestFormContentProps> = ({
  onClose,
  initialType,
  initialSeat,
  initialTargetEmployeeId,
}) => {
  const [requestType, setRequestType] = useState<SeatRequestType>(initialType)
  const [targetEmployeeId, setTargetEmployeeId] = useState<number | ''>(
    initialTargetEmployeeId || ''
  )
  const [preferredSeatId, setPreferredSeatId] = useState<number | ''>(
    initialSeat ? initialSeat.id : ''
  )
  const [reason, setReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [createRequest, { isLoading }] = useCreateSeatRequestMutation()
  const { data: employeesData } = useGetEmployeesQuery({ employee_status: 'ACTIVE' })

  const activeEmployees = employeesData || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      await createRequest({
        request_type: requestType,
        target_employee_id: targetEmployeeId ? Number(targetEmployeeId) : undefined,
        preferred_seat_id: preferredSeatId ? Number(preferredSeatId) : undefined,
        reason: reason || undefined,
      }).unwrap()

      onClose()
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Failed to submit seat request')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-base font-bold text-slate-800">Submit Seat Request</h3>
          </div>
          <button
            onClick={onClose}
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
              {(['NEW_SEAT', 'RELOCATION', 'SWAP'] as SeatRequestType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setRequestType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    requestType === type
                      ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type === 'NEW_SEAT' ? 'New Seat' : type === 'RELOCATION' ? 'Relocation' : 'Seat Swap'}
                </button>
              ))}
            </div>
          </div>

          {(requestType === 'NEW_SEAT' || requestType === 'RELOCATION') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {requestType === 'RELOCATION' ? 'Target Desk for Relocation' : 'Preferred Desk'}
              </label>
              {initialSeat ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/60 border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Desk {initialSeat.seat_number}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                    Selected
                  </span>
                </div>
              ) : (
                <input
                  type="number"
                  value={preferredSeatId}
                  onChange={(e) => setPreferredSeatId(Number(e.target.value) || '')}
                  placeholder="Enter seat ID (optional)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              )}
            </div>
          )}

          {requestType === 'SWAP' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Employee to Swap With
              </label>
              <select
                value={targetEmployeeId}
                onChange={(e) => setTargetEmployeeId(Number(e.target.value) || '')}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">-- Choose employee to swap --</option>
                {activeEmployees.map((emp: Employee) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_code} - {emp.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Reason / Business Need
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for this seat request..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
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

export const SeatRequestModal: React.FC<SeatRequestModalProps> = ({
  isOpen,
  onClose,
  initialType = 'NEW_SEAT',
  initialSeat = null,
  initialTargetEmployeeId = null,
}) => {
  if (!isOpen) return null

  return (
    <SeatRequestFormContent
      onClose={onClose}
      initialType={initialType}
      initialSeat={initialSeat}
      initialTargetEmployeeId={initialTargetEmployeeId}
    />
  )
}
