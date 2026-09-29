import React, { useMemo, useState } from 'react'
import type { Employee, Seat } from '../../types'
import {
  useAssignSeatMutation,
  useDeleteSeatMutation,
  useReleaseSeatMutation,
  useRelocateSeatMutation,
  useSwapSeatsMutation,
  useUpdateSeatMutation,
} from '../../store/api/seatApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'

interface SeatActionModalProps {
  seat: Seat | null
  isOpen: boolean
  onClose: () => void
  onViewHistory: (seatId: number) => void
  availableSeats?: Seat[]
}

export const SeatActionModal: React.FC<SeatActionModalProps> = ({
  seat,
  isOpen,
  onClose,
  onViewHistory,
  availableSeats = [],
}) => {
  const [mode, setMode] = useState<'view' | 'assign_existing' | 'relocate' | 'swap'>('view')
  const [selectedEmpId, setSelectedEmpId] = useState<number | ''>('')
  const [targetSeatId, setTargetSeatId] = useState<number | ''>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [empSearch, setEmpSearch] = useState('')
  const [seatSearch, setSeatSearch] = useState('')

  const { data: employeesData } = useGetEmployeesQuery(
    { employee_status: 'ACTIVE' },
    { skip: !isOpen }
  )

  const [assignSeat, { isLoading: isAssigning }] = useAssignSeatMutation()
  const [releaseSeat, { isLoading: isReleasing }] = useReleaseSeatMutation()
  const [relocateSeat, { isLoading: isRelocating }] = useRelocateSeatMutation()
  const [swapSeats, { isLoading: isSwapping }] = useSwapSeatsMutation()
  const [updateSeat, { isLoading: isUpdating }] = useUpdateSeatMutation()
  const [deleteSeat, { isLoading: isDeleting }] = useDeleteSeatMutation()

  const activeEmployees = useMemo(() => employeesData || [], [employeesData])

  const filteredEmployees = useMemo(() => {
    if (!empSearch.trim()) return activeEmployees
    const term = empSearch.toLowerCase().trim()
    return activeEmployees.filter(
      (emp: Employee) =>
        emp.first_name.toLowerCase().includes(term) ||
        emp.last_name.toLowerCase().includes(term) ||
        emp.employee_code.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        (emp.email && emp.email.toLowerCase().includes(term))
    )
  }, [activeEmployees, empSearch])

  const swapCandidates = useMemo(() => {
    const list = seat?.employee_id
      ? activeEmployees.filter((e) => e.id !== seat.employee_id)
      : activeEmployees
    if (!empSearch.trim()) return list
    const term = empSearch.toLowerCase().trim()
    return list.filter(
      (emp: Employee) =>
        emp.first_name.toLowerCase().includes(term) ||
        emp.last_name.toLowerCase().includes(term) ||
        emp.employee_code.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term) ||
        (emp.email && emp.email.toLowerCase().includes(term))
    )
  }, [activeEmployees, seat, empSearch])

  const vacantSeats = useMemo(() => {
    const vacant = availableSeats.filter(
      (s) => s.id !== seat?.id && s.status === 'Vacant'
    )
    if (!seatSearch.trim()) return vacant
    const term = seatSearch.toLowerCase().trim()
    return vacant.filter((s) => s.seat_number.toLowerCase().includes(term))
  }, [availableSeats, seat, seatSearch])

  const selectedEmployee = useMemo(() => {
    if (!selectedEmpId) return null
    return activeEmployees.find((e) => e.id === selectedEmpId) || null
  }, [activeEmployees, selectedEmpId])

  const selectedTargetSeat = useMemo(() => {
    if (!targetSeatId) return null
    return availableSeats.find((s) => s.id === targetSeatId) || null
  }, [availableSeats, targetSeatId])

  const handleClose = () => {
    setMode('view')
    setSelectedEmpId('')
    setTargetSeatId('')
    setEmpSearch('')
    setSeatSearch('')
    setErrorMessage(null)
    onClose()
  }

  if (!isOpen || !seat) return null

  const isOccupied = seat.status === 'Occupied'
  const isBlocked = seat.status === 'Blocked'

  const handleToggleBlock = async () => {
    setErrorMessage(null)
    try {
      const nextStatus = isBlocked ? 'Vacant' : 'Blocked'
      await updateSeat({
        seatId: seat.id,
        payload: { status: nextStatus },
      }).unwrap()
      handleClose()
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setErrorMessage(apiErr?.data?.detail || 'Failed to update seat status')
    }
  }

  const handleDeleteSeat = async () => {
    setErrorMessage(null)
    try {
      await deleteSeat(seat.id).unwrap()
      handleClose()
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setErrorMessage(apiErr?.data?.detail || 'Failed to delete seat')
    }
  }

  const handleAssignExisting = async () => {
    if (!selectedEmpId) {
      setErrorMessage('Please select an employee')
      return
    }
    setErrorMessage(null)
    try {
      await assignSeat({
        seatId: seat.id,
        payload: { employee_id: Number(selectedEmpId) },
      }).unwrap()
      handleClose()
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setErrorMessage(apiErr?.data?.detail || 'Failed to assign seat')
    }
  }

  const handleRelease = async () => {
    if (!window.confirm(`Are you sure you want to release seat ${seat.seat_number}?`)) {
      return
    }
    setErrorMessage(null)
    try {
      await releaseSeat({
        seatId: seat.id,
        payload: {},
      }).unwrap()
      handleClose()
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setErrorMessage(apiErr?.data?.detail || 'Failed to release seat')
    }
  }

  const handleRelocate = async () => {
    if (!targetSeatId) {
      setErrorMessage('Please select a destination desk')
      return
    }
    setErrorMessage(null)
    try {
      await relocateSeat({
        current_seat_id: seat.id,
        target_seat_id: Number(targetSeatId),
      }).unwrap()
      handleClose()
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setErrorMessage(apiErr?.data?.detail || 'Failed to relocate seat')
    }
  }

  const handleSwap = async () => {
    if (!selectedEmpId) {
      setErrorMessage('Please select target employee to swap with')
      return
    }
    setErrorMessage(null)
    try {
      await swapSeats({
        seat_id: seat.id,
        target_employee_id: Number(selectedEmpId),
      }).unwrap()
      handleClose()
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setErrorMessage(apiErr?.data?.detail || 'Failed to swap seats')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Seat {seat.seat_number}</h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isOccupied
                      ? 'bg-orange-100 text-orange-700'
                      : isBlocked
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {seat.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {seat.building_name || 'Building'} · {seat.floor_name || 'Floor'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
              {errorMessage}
            </div>
          )}

          {mode === 'view' && (
            <>
              {isOccupied ? (
                <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-200/60 flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {seat.employee_name ? seat.employee_name.charAt(0) : 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Occupant
                    </div>
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {seat.employee_name || 'Assigned Employee'}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {seat.employee_code} · {seat.employee_email}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center space-x-3 text-slate-600 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Vacant — Available for assignment</span>
                </div>
              )}

              <div className="space-y-3 pt-2">
                {!isOccupied && !isBlocked && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('assign_existing')
                      setSelectedEmpId('')
                      setEmpSearch('')
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                  >
                    <span>Assign Provisioned Employee</span>
                  </button>
                )}

                {isOccupied && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('relocate')
                        setTargetSeatId('')
                        setSeatSearch('')
                      }}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:border-orange-500 hover:text-orange-600 transition cursor-pointer"
                    >
                      Relocate Desk
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('swap')
                        setSelectedEmpId('')
                        setEmpSearch('')
                      }}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:border-orange-500 hover:text-orange-600 transition cursor-pointer"
                    >
                      Swap Seat
                    </button>
                  </div>
                )}

                {isOccupied && (
                  <button
                    type="button"
                    onClick={handleRelease}
                    disabled={isReleasing}
                    className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition cursor-pointer"
                  >
                    {isReleasing ? 'Releasing...' : 'Release Assignment'}
                  </button>
                )}

                {!isOccupied && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleToggleBlock}
                      disabled={isUpdating}
                      className="py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
                    >
                      {isBlocked ? 'Mark Available' : 'Mark as Blocked'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSeat}
                      disabled={isDeleting}
                      className="py-2 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition cursor-pointer"
                    >
                      Delete Seat
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onViewHistory(seat.id)}
                  className="w-full py-1.5 px-4 text-slate-500 hover:text-slate-800 text-xs font-medium hover:underline transition cursor-pointer"
                >
                  View Assignment History & Audit Trail
                </button>
              </div>
            </>
          )}

          {mode === 'assign_existing' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Search & Select Provisioned Employee
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    placeholder="Search by name, employee code, department, email..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-xs"
                  />
                  <svg
                    className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none"
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
                  {empSearch && (
                    <button
                      type="button"
                      onClick={() => setEmpSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span>
                  {filteredEmployees.length} active employee{filteredEmployees.length === 1 ? '' : 's'}
                </span>
                {selectedEmployee && (
                  <span className="text-orange-600 font-semibold truncate max-w-[200px]">
                    Selected: {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </span>
                )}
              </div>

              {filteredEmployees.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p>No active employees match &quot;{empSearch}&quot;</p>
                  {empSearch && (
                    <button
                      type="button"
                      onClick={() => setEmpSearch('')}
                      className="mt-2 text-orange-600 font-medium hover:underline text-xs cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white shadow-xs">
                  {filteredEmployees.map((emp: Employee) => {
                    const isSelected = selectedEmpId === emp.id
                    return (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmpId(emp.id)}
                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-orange-50/90 border-l-4 border-orange-500 font-medium'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {emp.first_name?.[0] || 'E'}
                            {emp.last_name?.[0] || ''}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {emp.first_name} {emp.last_name}
                              </span>
                              <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {emp.employee_code}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {emp.designation} · {emp.department}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {isSelected ? (
                            <span className="inline-flex items-center text-xs font-bold text-orange-600">
                              Selected
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Select
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('view')
                    setSelectedEmpId('')
                    setEmpSearch('')
                  }}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleAssignExisting}
                  disabled={isAssigning || !selectedEmpId}
                  className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isAssigning
                    ? 'Assigning...'
                    : selectedEmployee
                    ? `Assign ${selectedEmployee.first_name} to ${seat.seat_number}`
                    : 'Assign to Desk'}
                </button>
              </div>
            </div>
          )}

          {mode === 'relocate' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Destination Vacant Desk
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={seatSearch}
                    onChange={(e) => setSeatSearch(e.target.value)}
                    placeholder="Search destination desk number..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-xs"
                  />
                  <svg
                    className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none"
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
                  {seatSearch && (
                    <button
                      type="button"
                      onClick={() => setSeatSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {vacantSeats.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p>No vacant desks found matching &quot;{seatSearch}&quot;</p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {vacantSeats.map((vSeat) => {
                    const isSelected = targetSeatId === vSeat.id
                    return (
                      <button
                        type="button"
                        key={vSeat.id}
                        onClick={() => setTargetSeatId(vSeat.id)}
                        className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900 font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-orange-400'
                        }`}
                      >
                        <div className="text-xs font-mono font-bold truncate">
                          {vSeat.seat_number}
                        </div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-zinc-300' : 'text-slate-400'
                          }`}
                        >
                          Vacant
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('view')
                    setTargetSeatId('')
                    setSeatSearch('')
                  }}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRelocate}
                  disabled={isRelocating || !targetSeatId}
                  className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isRelocating
                    ? 'Relocating...'
                    : selectedTargetSeat
                    ? `Move to ${selectedTargetSeat.seat_number}`
                    : 'Confirm Relocation'}
                </button>
              </div>
            </div>
          )}

          {mode === 'swap' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Employee to Swap With
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    placeholder="Search employee by name, code, department..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-xs"
                  />
                  <svg
                    className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none"
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
                  {empSearch && (
                    <button
                      type="button"
                      onClick={() => setEmpSearch('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {swapCandidates.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p>No active employees match &quot;{empSearch}&quot;</p>
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white shadow-xs">
                  {swapCandidates.map((emp: Employee) => {
                    const isSelected = selectedEmpId === emp.id
                    return (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmpId(emp.id)}
                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-orange-50/90 border-l-4 border-orange-500 font-medium'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {emp.first_name?.[0] || 'E'}
                            {emp.last_name?.[0] || ''}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {emp.first_name} {emp.last_name}
                              </span>
                              <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {emp.employee_code}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {emp.designation} · {emp.department}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {isSelected ? (
                            <span className="inline-flex items-center text-xs font-bold text-orange-600">
                              Selected
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Select
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('view')
                    setSelectedEmpId('')
                    setEmpSearch('')
                  }}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSwap}
                  disabled={isSwapping || !selectedEmpId}
                  className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSwapping ? 'Swapping...' : 'Confirm Swap'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
