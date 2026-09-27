import React, { useMemo, useState } from 'react'
import type { Seat } from '../../types'
import { SeatCard } from './SeatCard'

interface FloorMapGridProps {
  seats: Seat[]
  onSelectSeat: (seat: Seat) => void
  currentEmployeeId?: number | null
}

const DESKS_PER_BAY = 8

export const FloorMapGrid: React.FC<FloorMapGridProps> = ({
  seats,
  onSelectSeat,
  currentEmployeeId = null,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Vacant' | 'Occupied' | 'Blocked'>('ALL')

  const sortedSeats = useMemo(() => {
    return [...seats].sort((a, b) =>
      a.seat_number.localeCompare(b.seat_number, undefined, { numeric: true, sensitivity: 'base' })
    )
  }, [seats])

  const filteredSeats = useMemo(() => {
    return sortedSeats.filter((seat) => {
      if (statusFilter !== 'ALL' && seat.status !== statusFilter) {
        return false
      }
      if (!searchTerm.trim()) return true
      const term = searchTerm.toLowerCase().trim()
      const matchSeat = seat.seat_number.toLowerCase().includes(term)
      const matchEmp = seat.employee_name?.toLowerCase().includes(term)
      const matchCode = seat.employee_code?.toLowerCase().includes(term)
      const matchEmail = seat.employee_email?.toLowerCase().includes(term)
      return matchSeat || matchEmp || matchCode || matchEmail
    })
  }, [sortedSeats, statusFilter, searchTerm])

  const bays = useMemo(() => {
    const list: { id: number; title: string; rangeLabel: string; seats: Seat[] }[] = []
    for (let i = 0; i < filteredSeats.length; i += DESKS_PER_BAY) {
      const baySeats = filteredSeats.slice(i, i + DESKS_PER_BAY)
      const bayIndex = Math.floor(i / DESKS_PER_BAY) + 1
      const firstNum = baySeats[0]?.seat_number || ''
      const lastNum = baySeats[baySeats.length - 1]?.seat_number || ''
      const rangeLabel = firstNum && lastNum ? `${firstNum} - ${lastNum}` : ''

      list.push({
        id: bayIndex,
        title: `Workstation Bay ${String(bayIndex).padStart(2, '0')}`,
        rangeLabel,
        seats: baySeats,
      })
    }
    return list
  }, [filteredSeats])

  const stats = useMemo(() => {
    const vacant = seats.filter((s) => s.status === 'Vacant').length
    const occupied = seats.filter((s) => s.status === 'Occupied').length
    const blocked = seats.filter((s) => s.status === 'Blocked').length
    return { total: seats.length, vacant, occupied, blocked }
  }, [seats])

  if (seats.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
        <p className="text-slate-500 font-medium">No seats mapped on this floor yet.</p>
      </div>
    )
  }

  const midPoint = Math.ceil(bays.length / 2)
  const leftWingBays = bays.slice(0, midPoint)
  const rightWingBays = bays.slice(midPoint)

  const renderBay = (bay: { id: number; title: string; rangeLabel: string; seats: Seat[] }) => {
    const half = Math.ceil(bay.seats.length / 2)
    const frontRow = bay.seats.slice(0, half)
    const backRow = bay.seats.slice(half)

    const vacantCount = bay.seats.filter((s) => s.status === 'Vacant').length
    const occupiedCount = bay.seats.filter((s) => s.status === 'Occupied').length

    return (
      <div key={bay.id} className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              {bay.title}
            </h4>
            {bay.rangeLabel && (
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {bay.rangeLabel}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
              {vacantCount} Vacant
            </span>
            <span className="text-orange-700 font-medium bg-orange-50 px-2 py-0.5 rounded">
              {occupiedCount} Occupied
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Front Row</span>
              <span className="text-[10px] font-normal text-slate-400">{frontRow.length} desks</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {frontRow.map((seat) => (
                <SeatCard
                  key={seat.id}
                  seat={seat}
                  onClick={onSelectSeat}
                  isCurrentEmployeeSeat={Boolean(
                    currentEmployeeId && seat.employee_id === currentEmployeeId
                  )}
                />
              ))}
            </div>
          </div>

          {backRow.length > 0 && (
            <div className="pt-2 border-t border-dashed border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Back Row</span>
                <span className="text-[10px] font-normal text-slate-400">{backRow.length} desks</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {backRow.map((seat) => (
                  <SeatCard
                    key={seat.id}
                    seat={seat}
                    onClick={onSelectSeat}
                    isCurrentEmployeeSeat={Boolean(
                      currentEmployeeId && seat.employee_id === currentEmployeeId
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search seat number (e.g. 44, NB GF 44) or employee name..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Desks ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Vacant')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'Vacant'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Vacant ({stats.vacant})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Occupied')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'Occupied'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            Occupied ({stats.occupied})
          </button>
          {stats.blocked > 0 && (
            <button
              type="button"
              onClick={() => setStatusFilter('Blocked')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'Blocked'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Blocked ({stats.blocked})
            </button>
          )}
        </div>
      </div>

      {filteredSeats.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
          <p className="text-slate-600 font-medium text-sm">No desks match your filter criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('ALL')
            }}
            className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Zone A / West Wing (Bays 1–{midPoint})</span>
              <span className="text-[11px] font-normal text-slate-400">
                {leftWingBays.reduce((acc, b) => acc + b.seats.length, 0)} desks
              </span>
            </div>
            {leftWingBays.map(renderBay)}
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Zone B / East Wing (Bays {midPoint + 1}–{bays.length})</span>
              <span className="text-[11px] font-normal text-slate-400">
                {rightWingBays.reduce((acc, b) => acc + b.seats.length, 0)} desks
              </span>
            </div>
            {rightWingBays.map(renderBay)}
          </div>
        </div>
      )}
    </div>
  )
}
