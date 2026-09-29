import React from 'react'
import { useGetSeatHistoryQuery } from '../../store/api/seatApi'

interface SeatHistoryModalProps {
  seatId: number | null
  isOpen: boolean
  onClose: () => void
}

export const SeatHistoryModal: React.FC<SeatHistoryModalProps> = ({
  seatId,
  isOpen,
  onClose,
}) => {
  const { data: histories, isLoading } = useGetSeatHistoryQuery(seatId!, {
    skip: !isOpen || !seatId,
  })

  if (!isOpen || !seatId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Seat #{seatId} Assignment History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            &times;
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          {isLoading && (
            <div className="py-8 text-center text-xs text-slate-400">Loading history...</div>
          )}

          {!isLoading && (!histories || histories.length === 0) && (
            <div className="py-8 text-center text-xs text-slate-400">
              No history recorded for this seat yet.
            </div>
          )}

          {histories?.map((h) => (
            <div
              key={h.id}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between text-xs"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {h.action}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {h.employee_name || 'No employee'}
                  </span>
                </div>
                {h.employee_code && (
                  <div className="text-[11px] text-slate-400 mt-1">Code: {h.employee_code}</div>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {new Date(h.action_date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
