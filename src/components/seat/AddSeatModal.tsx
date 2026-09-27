import React, { useState, useMemo } from 'react'
import type { Seat } from '../../types'
import {
  useBatchCreateSeatsMutation,
  useCreateSeatMutation,
} from '../../store/api/seatApi'

interface AddSeatModalProps {
  isOpen: boolean
  onClose: () => void
  floorId: number
  floorName: string
  existingSeats?: Seat[]
}

export const AddSeatModal: React.FC<AddSeatModalProps> = ({
  isOpen,
  onClose,
  floorId,
  floorName,
  existingSeats = [],
}) => {
  const [createSeat, { isLoading: isCreatingSingle }] = useCreateSeatMutation()
  const [batchCreateSeats, { isLoading: isCreatingBatch }] = useBatchCreateSeatsMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const detectedPrefix = useMemo(() => {
    if (existingSeats.length > 0) {
      const match = existingSeats[0].seat_number.match(/^([A-Za-z0-9\s]+[-_\s])/)
      if (match) return match[1]
    }
    const cleanFloor = floorName.toLowerCase()
    if (cleanFloor.includes('ground') || cleanFloor.includes('gf')) return 'NB GF '
    const numMatch = floorName.match(/[0-9]+/)
    if (numMatch) return `NB F${numMatch[0]} `
    return 'NB GF '
  }, [existingSeats, floorName])

  const nextNumber = useMemo(() => {
    let maxNum = 0
    const prefixTrim = detectedPrefix.trim().toUpperCase()
    for (const s of existingSeats) {
      const sNum = s.seat_number.trim().toUpperCase()
      if (sNum.startsWith(prefixTrim)) {
        const suffix = sNum.slice(prefixTrim.length).trim()
        const parsed = parseInt(suffix, 10)
        if (!isNaN(parsed) && parsed > maxNum) {
          maxNum = parsed
        }
      }
    }
    return maxNum + 1
  }, [existingSeats, detectedPrefix])

  const [isMultiple, setIsMultiple] = useState(false)
  const [seatNumber, setSeatNumber] = useState('')
  const [multipleCount, setMultipleCount] = useState<number>(80)

  const currentSeatNumber = seatNumber || `${detectedPrefix}${String(nextNumber).padStart(2, '0')}`

  const handleClose = () => {
    setSeatNumber('')
    setIsMultiple(false)
    setMultipleCount(80)
    setErrorMessage(null)
    onClose()
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    try {
      if (isMultiple) {
        await batchCreateSeats({
          floor_id: floorId,
          count: multipleCount,
          prefix: detectedPrefix,
          start_number: nextNumber,
          seat_type: 'Standard',
        }).unwrap()
      } else {
        await createSeat({
          floor_id: floorId,
          seat_number: currentSeatNumber.trim(),
          seat_type: 'Standard',
          status: 'Vacant',
        }).unwrap()
      }
      handleClose()
    } catch (err: unknown) {
      const apiErr = err as { data?: { detail?: string } }
      setErrorMessage(apiErr?.data?.detail || 'Failed to add desk(s)')
    }
  }

  const isSubmitting = isCreatingSingle || isCreatingBatch

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              +
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Add Desk to {floorName}
              </h3>
              <p className="text-xs text-slate-400">
                {existingSeats.length} desk{existingSeats.length === 1 ? '' : 's'} currently configured
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
              {errorMessage}
            </div>
          )}

          {!isMultiple ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Desk Number
              </label>
              <input
                type="text"
                required
                value={seatNumber || `${detectedPrefix}${String(nextNumber).padStart(2, '0')}`}
                onChange={(e) => setSeatNumber(e.target.value)}
                placeholder="e.g. NB GF 45"
                className="w-full px-3 py-2 text-sm font-mono font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Suggested automatically as the next desk on this floor. You can edit if needed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  How many desks to add?
                </label>
                <div className="flex gap-2 mb-2">
                  {[10, 20, 40, 80].map((cnt) => (
                    <button
                      type="button"
                      key={cnt}
                      onClick={() => setMultipleCount(cnt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        multipleCount === cnt
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cnt === 80 ? 'Full Floor (80)' : `${cnt}`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={multipleCount}
                  onChange={(e) => setMultipleCount(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 space-y-1">
                <span className="font-semibold block">Batch preview:</span>
                <p className="text-[11px] text-blue-700 font-mono">
                  {detectedPrefix}{String(nextNumber).padStart(2, '0')} ... {detectedPrefix}{String(nextNumber + multipleCount - 1).padStart(2, '0')} ({multipleCount} desks)
                </p>
              </div>
            </div>
          )}

          <div className="pt-1">
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isMultiple}
                onChange={(e) => setIsMultiple(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span>Add multiple desks in sequence</span>
            </label>
          </div>

          <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Adding...'
                : isMultiple
                ? `Add ${multipleCount} Desks`
                : 'Add Desk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
