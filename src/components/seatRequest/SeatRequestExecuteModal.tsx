import React, { useState } from 'react'
import type { SeatRequest } from '../../types'
import { useExecuteSeatRequestMutation } from '../../store/api/seatRequestApi'
import { useGetAssetsQuery } from '../../store/api/assetApi'

interface SeatRequestExecuteModalProps {
  request: SeatRequest | null
  isOpen: boolean
  onClose: () => void
}

const SeatRequestExecuteForm: React.FC<{
  request: SeatRequest
  onClose: () => void
}> = ({ request, onClose }) => {
  const initialSeatId =
    request.details?.preferred_seat_id || request.details?.target_seat_id || ''
  const initialAssetId = request.asset_id || ''

  const [seatId, setSeatId] = useState<number | ''>(initialSeatId)
  const [assetId, setAssetId] = useState<number | ''>(initialAssetId)
  const [replacementAssetId, setReplacementAssetId] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isAssetRequest =
    request.request_type === 'ASSET_NEW' ||
    request.request_type === 'ASSET_MAINTENANCE' ||
    request.request_type === 'ASSET_REPLACEMENT'

  const { data: availableAssets = [] } = useGetAssetsQuery(
    {
      status: 'Available',
      asset_type: request.asset_type || undefined,
    },
    { skip: !isAssetRequest }
  )

  const [executeRequest, { isLoading }] = useExecuteSeatRequestMutation()

  const handleExecute = async () => {
    setErrorMessage(null)

    if (request.request_type === 'ASSET_NEW' && !assetId) {
      setErrorMessage('Please select an available asset to allocate')
      return
    }

    if (request.request_type === 'ASSET_REPLACEMENT' && !replacementAssetId) {
      setErrorMessage('Please select a replacement asset from available inventory')
      return
    }

    try {
      await executeRequest({
        requestId: request.id,
        payload: {
          seat_id: seatId ? Number(seatId) : undefined,
          asset_id: assetId ? Number(assetId) : undefined,
          replacement_asset_id: replacementAssetId ? Number(replacementAssetId) : undefined,
          notes: notes.trim() || undefined,
        },
      }).unwrap()

      handleClose()
    } catch (err: any) {
      setErrorMessage(err?.data?.detail || 'Failed to execute request')
    }
  }

  const handleClose = () => {
    setSeatId('')
    setAssetId('')
    setReplacementAssetId('')
    setNotes('')
    setErrorMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isAssetRequest ? 'Admin/IT Asset Execution' : 'Admin/Ops Seating Execution'} · #{request.id}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Finalize and apply approved changes</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium border border-rose-200">
              {errorMessage}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
            <div>
              <span className="text-slate-500">Employee: </span>
              <span className="text-slate-900 font-semibold">{request.employee_name}</span>
            </div>
            <div>
              <span className="text-slate-500">Request: </span>
              <span className="text-slate-800 font-medium">{request.request_type}</span>
            </div>
            {request.asset_type && (
              <div>
                <span className="text-slate-500">Asset Type: </span>
                <span className="text-slate-800 font-medium">{request.asset_type}</span>
              </div>
            )}
            {request.details?.reason && (
              <div>
                <span className="text-slate-500">Reason: </span>
                <span className="text-slate-700">{request.details.reason}</span>
              </div>
            )}
            <div>
              <span className="text-slate-500">Manager Approval: </span>
              <span className="text-emerald-700 font-semibold">
                {request.approver_name || 'Approved'}
              </span>
            </div>
          </div>

          {request.request_type === 'ASSET_NEW' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Available {request.asset_type || 'Asset'}
              </label>
              {availableAssets.length === 0 ? (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  No Available {request.asset_type || 'assets'} in inventory right now. Please add one in Asset Inventory first.
                </div>
              ) : (
                <select
                  value={assetId}
                  onChange={(e) => setAssetId(Number(e.target.value) || '')}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">-- Choose asset from inventory --</option>
                  {availableAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.asset_code} · {a.model_name || 'Standard'} (S/N: {a.serial_number || 'N/A'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {request.request_type === 'ASSET_REPLACEMENT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Replacement {request.asset_type || 'Asset'}
              </label>
              {availableAssets.length === 0 ? (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  No Available replacement {request.asset_type || 'assets'} found in inventory.
                </div>
              ) : (
                <select
                  value={replacementAssetId}
                  onChange={(e) => setReplacementAssetId(Number(e.target.value) || '')}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">-- Choose replacement asset --</option>
                  {availableAssets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.asset_code} · {a.model_name || 'Standard'} (S/N: {a.serial_number || 'N/A'})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {!isAssetRequest && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Seat ID Confirmation
              </label>
              <input
                type="number"
                value={seatId}
                onChange={(e) => setSeatId(Number(e.target.value) || '')}
                placeholder="Target Seat ID"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operational Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Allocation processed & verified on site"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecute}
              disabled={isLoading}
              className="flex-1 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Executing...' : 'Complete & Execute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SeatRequestExecuteModal: React.FC<SeatRequestExecuteModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !request) return null

  return <SeatRequestExecuteForm key={request.id} request={request} onClose={onClose} />
}

export default SeatRequestExecuteModal
