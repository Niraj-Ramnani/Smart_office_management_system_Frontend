import React, { useState } from 'react'
import type { Asset, SeatRequestType, AssetType, Seat } from '../../types'
import { useCreateSeatRequestMutation } from '../../store/api/seatRequestApi'
import { useListSeatsQuery } from '../../store/api/seatApi'

export type RequestModalMode =
  | 'SEAT_CHANGE'
  | 'ASSET_NEW'
  | 'ASSET_MAINTENANCE'
  | 'ASSET_REPLACEMENT'

interface EmployeeRequestModalProps {
  isOpen: boolean
  onClose: () => void
  assignedAssets: Asset[]
  initialMode?: RequestModalMode
  preselectedAsset?: Asset | null
}

const EmployeeRequestModalForm: React.FC<Omit<EmployeeRequestModalProps, 'isOpen'>> = ({
  onClose,
  assignedAssets,
  initialMode = 'SEAT_CHANGE',
  preselectedAsset = null,
}) => {
  const [mode, setMode] = useState<RequestModalMode>(initialMode)
  const [targetSeatId, setTargetSeatId] = useState<number | ''>('')
  const [assetType, setAssetType] = useState<AssetType>('Monitor')
  const [selectedAssetId, setSelectedAssetId] = useState<number | ''>(
    preselectedAsset ? preselectedAsset.id : assignedAssets.length > 0 ? assignedAssets[0].id : ''
  )
  const [reason, setReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [createRequest, { isLoading }] = useCreateSeatRequestMutation()
  const { data: seats = [] } = useListSeatsQuery()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    let request_type: SeatRequestType = 'RELOCATION'
    let payloadAssetType: string | undefined = undefined
    let payloadAssetId: number | undefined = undefined

    if (mode === 'SEAT_CHANGE') {
      request_type = 'RELOCATION'
    } else if (mode === 'ASSET_NEW') {
      request_type = 'ASSET_NEW'
      payloadAssetType = assetType
    } else if (mode === 'ASSET_MAINTENANCE') {
      request_type = 'ASSET_MAINTENANCE'
      payloadAssetId = selectedAssetId ? Number(selectedAssetId) : undefined
      const chosen = assignedAssets.find((a) => a.id === selectedAssetId)
      payloadAssetType = chosen?.asset_type
    } else if (mode === 'ASSET_REPLACEMENT') {
      request_type = 'ASSET_REPLACEMENT'
      payloadAssetId = selectedAssetId ? Number(selectedAssetId) : undefined
      const chosen = assignedAssets.find((a) => a.id === selectedAssetId)
      payloadAssetType = chosen?.asset_type
    }

    try {
      await createRequest({
        request_type,
        target_seat_id: mode === 'SEAT_CHANGE' && targetSeatId ? Number(targetSeatId) : undefined,
        asset_type: payloadAssetType,
        asset_id: payloadAssetId,
        reason: reason.trim() || undefined,
      }).unwrap()

      handleClose()
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Failed to submit request')
    }
  }

  const handleClose = () => {
    setReason('')
    setTargetSeatId('')
    setErrorMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <h3 className="text-base font-bold text-slate-800">
              {mode === 'SEAT_CHANGE' && 'Request Seat Change / Relocation'}
              {mode === 'ASSET_NEW' && 'Request New Asset'}
              {mode === 'ASSET_MAINTENANCE' && 'Report Asset Issue / Maintenance'}
              {mode === 'ASSET_REPLACEMENT' && 'Request Asset Replacement'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Request Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('SEAT_CHANGE')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left ${
                  mode === 'SEAT_CHANGE'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Seat Change / Swap
              </button>
              <button
                type="button"
                onClick={() => setMode('ASSET_NEW')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left ${
                  mode === 'ASSET_NEW'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Request New Asset
              </button>
              <button
                type="button"
                onClick={() => setMode('ASSET_MAINTENANCE')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left ${
                  mode === 'ASSET_MAINTENANCE'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Asset Maintenance
              </button>
              <button
                type="button"
                onClick={() => setMode('ASSET_REPLACEMENT')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left ${
                  mode === 'ASSET_REPLACEMENT'
                    ? 'bg-orange-50 border-orange-500 text-orange-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Asset Replacement
              </button>
            </div>
          </div>

          {mode === 'SEAT_CHANGE' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Seat / Desk
              </label>
              <select
                value={targetSeatId}
                onChange={(e) => setTargetSeatId(Number(e.target.value) || '')}
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">-- Choose target seat --</option>
                {seats.map((seat: Seat) => (
                  <option key={seat.id} value={seat.id}>
                    {seat.seat_number} · Floor {seat.floor_id} ({seat.status}
                    {seat.employee_name ? ` - Occupied by ${seat.employee_name}` : ''})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                If the desk is occupied, a seat swap request will be sent to the current occupant for consent.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 p-2.5 bg-orange-50/60 rounded-xl border border-orange-200/60">
                <span>Want to see where desks are located?</span>
                <a
                  href="/seats"
                  className="font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                  onClick={handleClose}
                >
                  Browse Seating Map &rarr;
                </a>
              </div>
            </div>
          )}

          {mode === 'ASSET_NEW' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Asset Type Needed
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Monitor', 'Mouse', 'Earphone', 'Desktop'] as AssetType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setAssetType(type)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
                      assetType === type
                        ? 'bg-orange-50 border-orange-500 text-orange-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(mode === 'ASSET_MAINTENANCE' || mode === 'ASSET_REPLACEMENT') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Your Assigned Asset
              </label>
              {assignedAssets.length === 0 ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                  You currently have no active assigned assets.
                </div>
              ) : (
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(Number(e.target.value) || '')}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  {assignedAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.asset_type} ({asset.asset_code}) - {asset.model_name || 'Standard'}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {mode === 'SEAT_CHANGE'
                ? 'Reason for Seat Change'
                : mode === 'ASSET_NEW'
                ? 'Business Justification'
                : mode === 'ASSET_MAINTENANCE'
                ? 'Description of Issue / Malfunction'
                : 'Reason for Replacement Request'}
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder={
                mode === 'SEAT_CHANGE'
                  ? 'e.g. Need to sit closer to product team...'
                  : mode === 'ASSET_NEW'
                  ? 'e.g. Extra monitor required for workflow...'
                  : mode === 'ASSET_MAINTENANCE'
                  ? 'e.g. Monitor display flickers intermittently...'
                  : 'e.g. Mouse scroll wheel is non-responsive...'
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || ((mode === 'ASSET_MAINTENANCE' || mode === 'ASSET_REPLACEMENT') && assignedAssets.length === 0)}
              className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const EmployeeRequestModal: React.FC<EmployeeRequestModalProps> = ({
  isOpen,
  onClose,
  assignedAssets,
  initialMode,
  preselectedAsset,
}) => {
  if (!isOpen) return null

  return (
    <EmployeeRequestModalForm
      key={`${initialMode}-${preselectedAsset?.id || 'none'}`}
      onClose={onClose}
      assignedAssets={assignedAssets}
      initialMode={initialMode}
      preselectedAsset={preselectedAsset}
    />
  )
}
