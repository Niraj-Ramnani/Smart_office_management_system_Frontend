import React from 'react'
import type { Seat, SeatRequestType } from '../../types'

interface EmployeeSeatModalProps {
  seat: Seat | null
  isOpen: boolean
  onClose: () => void
  onRequestSeat: (seat: Seat, type: SeatRequestType) => void
  currentEmployeeId: number | null
}

export const EmployeeSeatModal: React.FC<EmployeeSeatModalProps> = ({
  seat,
  isOpen,
  onClose,
  onRequestSeat,
  currentEmployeeId,
}) => {
  if (!isOpen || !seat) return null

  const isMySeat = Boolean(currentEmployeeId && seat.employee_id === currentEmployeeId)
  const isOccupied = seat.status === 'Occupied'
  const isBlocked = seat.status === 'Blocked'
  const isVacant = seat.status === 'Vacant'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isMySeat
                  ? 'bg-emerald-500'
                  : isOccupied
                  ? 'bg-orange-500'
                  : isBlocked
                  ? 'bg-red-500'
                  : 'bg-slate-400'
              }`}
            />
            <h3 className="text-base font-bold text-slate-800">
              Desk {seat.seat_number}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Status</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                  isMySeat
                    ? 'bg-emerald-100 text-emerald-700'
                    : isOccupied
                    ? 'bg-orange-100 text-orange-700'
                    : isBlocked
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isMySeat ? 'Your Desk' : seat.status}
              </span>
            </div>

            {isOccupied && seat.employee_name && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Occupant</span>
                <span className="font-semibold text-slate-900">
                  {seat.employee_name}
                </span>
              </div>
            )}

            {isOccupied && seat.employee_code && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Employee Code</span>
                <span className="font-semibold text-slate-700">
                  {seat.employee_code}
                </span>
              </div>
            )}

            {isOccupied && seat.employee_email && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Email</span>
                <span className="font-medium text-slate-600 truncate max-w-[200px]">
                  {seat.employee_email}
                </span>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-600 bg-amber-50/70 border border-amber-200/70 p-3 rounded-xl leading-relaxed">
            {isMySeat ? (
              <p>
                This is your assigned workspace. To move to a different desk or floor, submit a relocation request to your manager.
              </p>
            ) : isVacant ? (
              <p>
                This desk is currently vacant. You can submit a request to your manager to be allocated to this seat.
              </p>
            ) : isOccupied ? (
              <p>
                This desk is occupied by a team member. You can submit a mutual swap request to your manager.
              </p>
            ) : (
              <p>This desk is temporarily unavailable for seating allocation.</p>
            )}
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Close
            </button>

            {isVacant && (
              <button
                type="button"
                onClick={() =>
                  onRequestSeat(seat, currentEmployeeId ? 'RELOCATION' : 'NEW_SEAT')
                }
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
              >
                Request This Desk
              </button>
            )}

            {isMySeat && (
              <button
                type="button"
                onClick={() => onRequestSeat(seat, 'RELOCATION')}
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
              >
                Request Relocation
              </button>
            )}

            {isOccupied && !isMySeat && (
              <button
                type="button"
                onClick={() => onRequestSeat(seat, 'SWAP')}
                className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
              >
                Request Swap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
