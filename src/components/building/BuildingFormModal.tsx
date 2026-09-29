import React from 'react'
import type { Building } from '../../types'
import { Modal } from '../common'

export interface BuildingFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingBuilding: Building | null
  code: string
  setCode: (val: string) => void
  name: string
  setName: (val: string) => void
  address: string
  setAddress: (val: string) => void
  formError: string | null
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const BuildingFormModal: React.FC<BuildingFormModalProps> = ({
  isOpen,
  onClose,
  editingBuilding,
  code,
  setCode,
  name,
  setName,
  address,
  setAddress,
  formError,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBuilding ? 'Edit Building' : 'Add New Building'}
    >
      {formError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Building Code *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. BLD-01"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Building Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Headquarters Tower"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Address
          </label>
          <textarea
            rows={3}
            placeholder="Street, City, State..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
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
            {isSubmitting ? 'Saving...' : editingBuilding ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
