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
    'flex flex-col items-center justify-between p-2 rounded-xl transition-all duration-150 cursor-pointer select-none text-center border h-21 w-22 sm:w-24 '

  if (isCurrentEmployeeSeat) {
    cardClasses +=
      'bg-emerald-600 border-emerald-700 text-white shadow-xs ring-2 ring-emerald-400 ring-offset-1 hover:bg-emerald-700'
  } else if (isOccupied) {
    cardClasses += 'bg-orange-500 border-orange-600 text-white shadow-xs hover:bg-orange-600'
  } else if (isBlocked) {
    cardClasses += 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
  } else {
    cardClasses += 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
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
            isOccupied ? 'text-orange-100' : 'text-slate-400'
          }`}
        >
          {seat.seat_number}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isOccupied
              ? 'bg-white'
              : isBlocked
              ? 'bg-red-500'
              : 'bg-slate-300'
          }`}
        />
      </div>

      <div className="my-auto flex flex-col items-center">
        {isOccupied ? (
          <svg
            className="w-4 h-4 text-white/90 mb-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
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
          className={`text-xs truncate max-w-[65px] ${
            isOccupied ? 'text-white font-bold' : 'text-slate-500 font-medium'
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
          : 'Vacant'}
      </div>
    </div>
  )
}
