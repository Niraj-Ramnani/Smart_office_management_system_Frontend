import React from 'react'
import type { Building, Floor } from '../../types'
import { Modal } from '../common'

export interface FloorFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingFloor: Floor | null
  buildings: Building[]
  buildingId: number
  setBuildingId: (val: number) => void
  name: string
  setName: (val: string) => void
  floorNumber: number
  setFloorNumber: (val: number) => void
  formError: string | null
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const FloorFormModal: React.FC<FloorFormModalProps> = ({
  isOpen,
  onClose,
  editingFloor,
  buildings,
  buildingId,
  setBuildingId,
  name,
  setName,
  floorNumber,
  setFloorNumber,
  formError,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingFloor ? 'Edit Floor' : 'Add New Floor'}
      maxWidth="md"
    >
      <div className="space-y-5">
        {formError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Building *
            </label>
            <select
              required
              value={buildingId}
              onChange={(e) => setBuildingId(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={0} disabled>
                Select Building
              </option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Floor Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ground Floor / Floor 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Floor Level / Number (e.g. 0 for Ground, 1 for 1st) *
            </label>
            <input
              type="number"
              required
              value={floorNumber}
              onChange={(e) => setFloorNumber(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : editingFloor ? 'Update Floor' : 'Create Floor'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
