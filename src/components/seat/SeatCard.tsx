import React from 'react'
import type { Seat } from '../../types'

interface SeatCardProps {
  seat: Seat
  onClick: (seat: Seat) => void
  isCurrentEmployeeSeat?: boolean
}

export const SeatCard: React.FC<SeatCardProps> = ({
  seat,
  onClick,
  isCurrentEmployeeSeat = false,
}) => {
  const isOccupied = seat.status === 'Occupied'
  const isBlocked = seat.status === 'Blocked'

  let cardClasses =
    'flex flex-col items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer select-none text-center border h-[84px] '

  if (isCurrentEmployeeSeat) {
    cardClasses +=
      'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-600 text-white shadow-md ring-2 ring-orange-300 ring-offset-1 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg'
  } else if (isOccupied) {
    cardClasses += 'bg-zinc-900 border-zinc-800 text-white shadow-xs hover:bg-zinc-800 hover:shadow-md'
  } else if (isBlocked) {
    cardClasses += 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
  } else {
    cardClasses += 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40 hover:shadow-sm'
  }

  const displayName = seat.employee_name
    ? seat.employee_name.split(' ')[0]
    : 'Vacant'

  return (
    <div
      onClick={() => onClick(seat)}
      className={cardClasses}
      role="button"
      tabIndex={0}
      title={`Seat ${seat.seat_number} - ${seat.status}${seat.employee_name ? ` (${seat.employee_name})` : ''}`}
    >
      <div className="flex items-center justify-between w-full px-0.5">
        <span
          className={`text-[10px] font-semibold ${
            isOccupied || isCurrentEmployeeSeat ? 'text-white/70' : 'text-slate-400'
          }`}
        >
          {seat.seat_number}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isCurrentEmployeeSeat
              ? 'bg-white'
              : isOccupied
              ? 'bg-zinc-500'
              : isBlocked
              ? 'bg-slate-300'
              : 'bg-emerald-500'
          }`}
        />
      </div>

      <div className="my-auto flex flex-col items-center">
        {isOccupied || isCurrentEmployeeSeat ? (
          <svg
            className="w-4 h-4 text-white/90 mb-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5 text-slate-300 mb-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        )}
        <span
          className={`text-xs truncate max-w-[70px] ${
            isOccupied || isCurrentEmployeeSeat ? 'text-white font-medium' : 'text-slate-600 font-normal'
          }`}
        >
          {displayName}
        </span>
      </div>

      <div className="text-[9px] uppercase tracking-wide font-medium opacity-80">
        {isCurrentEmployeeSeat
          ? 'Your Desk'
          : isOccupied
          ? 'Occupied'
          : isBlocked
          ? 'Blocked'
          : 'Available'}
      </div>
    </div>
  )
}

export default SeatCard
