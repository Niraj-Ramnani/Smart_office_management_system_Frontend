import React from 'react'

interface FloorMapHeaderProps {
  buildingName: string
  floorName: string
  totalSeats: number
  occupiedSeats: number
  vacantSeats: number
  onBack?: () => void
  isAdmin?: boolean
  onAddSeat?: () => void
}

export const FloorMapHeader: React.FC<FloorMapHeaderProps> = ({
  buildingName,
  floorName,
  totalSeats,
  occupiedSeats,
  vacantSeats,
  onBack,
  isAdmin = false,
  onAddSeat,
}) => {
  const occPercent = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>&larr;</span>
              <span>Dashboard</span>
            </button>
          )}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-slate-400">{buildingName}</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900">{floorName}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center space-x-4 text-xs font-medium">
            <div className="text-slate-600">
              <span className="font-bold text-slate-900 text-sm">{totalSeats}</span> Total
            </div>
            <div className="text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded font-semibold">
              <span className="font-bold text-sm">{occupiedSeats}</span> Occupied
            </div>
            <div className="text-slate-600">
              <span className="font-bold text-emerald-700 text-sm">{vacantSeats}</span> Vacant
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-medium">occ.</span>
            <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${occPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-orange-600">{occPercent}%</span>
          </div>

          {isAdmin && onAddSeat && (
            <button
              type="button"
              onClick={onAddSeat}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <span>+ Add Seat</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-5 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-900" />
          <span className="text-slate-600 text-[11px] font-medium">Occupied</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-600 text-[11px] font-medium">Vacant</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-slate-600 text-[11px] font-medium">Your Desk / Selected</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-slate-600 text-[11px] font-medium">Blocked</span>
        </div>
      </div>
    </div>
  )
}
