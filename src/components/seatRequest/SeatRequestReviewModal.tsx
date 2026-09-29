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
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {isApprove ? 'Approve Request' : 'Reject Request'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
              {errorMessage}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
            <div>
              <span className="text-slate-500">Employee: </span>
              <span className="text-slate-900 font-semibold">{request.employee_name}</span>
            </div>
            <div>
              <span className="text-slate-500">Request: </span>
              <span className="text-slate-800 font-medium">{request.request_type}</span>
            </div>
            {request.details?.reason && (
              <div>
                <span className="text-slate-500">Reason: </span>
                <span className="text-slate-700">{request.details.reason}</span>
              </div>
            )}
          </div>

          {!isApprove && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Reason
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 py-1.5 rounded-lg text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
                isApprove
                  ? 'bg-zinc-900 hover:bg-zinc-800'
                  : 'bg-rose-600 hover:bg-rose-700'
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

export default SeatRequestReviewModal
