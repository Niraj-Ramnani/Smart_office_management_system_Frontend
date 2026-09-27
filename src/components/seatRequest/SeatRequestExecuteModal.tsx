import React, { useState } from 'react'
import type { SeatRequest } from '../../types'
import { useExecuteSeatRequestMutation } from '../../store/api/seatRequestApi'

interface SeatRequestExecuteModalProps {
  request: SeatRequest | null
  isOpen: boolean
  onClose: () => void
}

export const SeatRequestExecuteModal: React.FC<SeatRequestExecuteModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const [seatId, setSeatId] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [executeRequest, { isLoading }] = useExecuteSeatRequestMutation()

  if (!isOpen || !request) return null

  const handleExecute = async () => {
    setErrorMessage(null)
    try {
      await executeRequest({
        requestId: request.id,
        payload: {
          seat_id: seatId ? Number(seatId) : undefined,
          notes: notes || undefined,
        },
      }).unwrap()
      handleClose()
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Failed to execute request')
    }
  }

  const handleClose = () => {
    setSeatId('')
    setNotes('')
    setErrorMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Execute Seat Request #{request.id}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
              {errorMessage}
            </div>
          )}

          <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100 text-xs space-y-1.5">
            <div>
              <span className="font-semibold text-slate-600">Employee: </span>
              <span className="text-slate-800 font-bold">{request.employee_name}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Type: </span>
              <span className="text-orange-600 font-bold">{request.request_type}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Approved by Manager: </span>
              <span className="text-slate-700 font-semibold">{request.approver_name || 'Yes'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Seat ID (optional override)
            </label>
            <input
              type="number"
              value={seatId}
              onChange={(e) => setSeatId(Number(e.target.value) || '')}
              placeholder={
                request.details?.preferred_seat_id
                  ? `Default: Seat ${request.details.preferred_seat_id}`
                  : 'Enter seat ID to allocate'
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Execution Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Allocation processed via Ops"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
            >
              {isLoading ? 'Executing...' : 'Confirm & Execute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
