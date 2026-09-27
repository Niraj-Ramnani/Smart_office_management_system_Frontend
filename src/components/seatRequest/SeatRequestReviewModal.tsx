import React, { useState } from 'react'
import type { SeatRequest } from '../../types'
import { useReviewSeatRequestMutation } from '../../store/api/seatRequestApi'

interface SeatRequestReviewModalProps {
  request: SeatRequest | null
  action: 'APPROVE' | 'REJECT' | null
  isOpen: boolean
  onClose: () => void
}

export const SeatRequestReviewModal: React.FC<SeatRequestReviewModalProps> = ({
  request,
  action,
  isOpen,
  onClose,
}) => {
  const [rejectReason, setRejectReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [reviewRequest, { isLoading }] = useReviewSeatRequestMutation()

  if (!isOpen || !request || !action) return null

  const isApprove = action === 'APPROVE'

  const handleConfirm = async () => {
    if (!isApprove && !rejectReason.trim()) {
      setErrorMessage('Please provide a reason for rejection')
      return
    }
    setErrorMessage(null)

    try {
      await reviewRequest({
        requestId: request.id,
        payload: {
          action,
          rejected_reason: !isApprove ? rejectReason : undefined,
        },
      }).unwrap()
      handleClose()
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Failed to submit review')
    }
  }

  const handleClose = () => {
    setRejectReason('')
    setErrorMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            {isApprove ? 'Approve Seat Request' : 'Reject Seat Request'}
          </h3>
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

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1.5">
            <div>
              <span className="font-semibold text-slate-600">Employee: </span>
              <span className="text-slate-800 font-bold">{request.employee_name}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">Request: </span>
              <span className="text-slate-800 font-bold">{request.request_type}</span>
            </div>
            {request.details?.reason && (
              <div>
                <span className="font-semibold text-slate-600">Reason: </span>
                <span className="text-slate-700">{request.details.reason}</span>
              </div>
            )}
          </div>

          {!isApprove && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition ${
                isApprove
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
              }`}
            >
              {isLoading ? 'Submitting...' : isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
