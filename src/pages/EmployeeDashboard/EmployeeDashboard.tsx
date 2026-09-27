import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { useGetMeQuery } from '../../store/api/baseApi'
import { useGetEmployeeByIdQuery } from '../../store/api/employeeApi'
import { useGetMyAssetsQuery } from '../../store/api/assetApi'
import {
  useGetMySeatRequestsQuery,
  useRespondSwapConsentMutation,
} from '../../store/api/seatRequestApi'
import { useListSeatsQuery } from '../../store/api/seatApi'
import type { Asset, SeatRequest, Seat } from '../../types'
import { Badge } from '../../components/common/Badge'
import {
  EmployeeRequestModal,
  type RequestModalMode,
} from '../../components/employeeDashboard/EmployeeRequestModal'

export const EmployeeDashboard: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.auth.user)
  const { data: currentUser } = useGetMeQuery()
  const effectiveUser = currentUser || authUser

  const employeeId = effectiveUser?.employee_id || 0
  const { data: employee } = useGetEmployeeByIdQuery(employeeId, {
    skip: !employeeId,
  })

  const { data: myAssets = [], isLoading: isAssetsLoading } = useGetMyAssetsQuery()
  const { data: myRequests = [], isLoading: isRequestsLoading } = useGetMySeatRequestsQuery()
  const { data: allSeats = [] } = useListSeatsQuery()

  const [respondConsent, { isLoading: isRespondingConsent }] = useRespondSwapConsentMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<RequestModalMode>('SEAT_CHANGE')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [requestFilter, setRequestFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL')

  const currentSeat = allSeats.find((s: Seat) => s.employee_id === employeeId)

  const pendingSwapConsents = myRequests.filter(
    (r) =>
      r.status === 'PENDING_CONSENT' &&
      r.details?.target_employee_id === employeeId &&
      r.employee_id !== employeeId
  )

  const openActionModal = (mode: RequestModalMode, asset: Asset | null = null) => {
    setModalMode(mode)
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  const handleConsentAction = async (requestId: number, action: 'ACCEPT' | 'REJECT') => {
    try {
      await respondConsent({
        requestId,
        payload: { action },
      }).unwrap()
    } catch (err) {
      console.error('Failed to submit swap response', err)
    }
  }

  const filteredRequests = myRequests.filter((r) => {
    if (requestFilter === 'PENDING') {
      return (
        r.status === 'PENDING' ||
        r.status === 'PENDING_CONSENT' ||
        r.status === 'MANAGER_APPROVED'
      )
    }
    if (requestFilter === 'RESOLVED') {
      return (
        r.status === 'COMPLETED' ||
        r.status === 'REJECTED' ||
        r.status === 'CANCELLED'
      )
    }
    return true
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950 p-5 rounded-xl text-white border border-zinc-800 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-lg font-bold tracking-tight text-white">
            Welcome, {employee ? `${employee.first_name} ${employee.last_name}` : 'Employee'}
          </h1>
          <p className="text-xs text-zinc-400">
            {employee?.designation || 'Team Member'} · {employee?.department || 'Department'} · {effectiveUser?.email}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openActionModal('SEAT_CHANGE')}
            className="py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <span>Request Seat Change</span>
          </button>
          <button
            type="button"
            onClick={() => openActionModal('ASSET_NEW')}
            className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <span>Request Equipment</span>
          </button>
        </div>
      </div>

      {pendingSwapConsents.length > 0 && (
        <div className="space-y-3">
          {pendingSwapConsents.map((req: SeatRequest) => (
            <div
              key={req.id}
              className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-150"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Seat Swap Request Awaiting Your Consent
                  </span>
                </div>
                <p className="text-xs text-slate-800">
                  <strong className="text-slate-900">{req.employee_name || 'A teammate'}</strong> ({req.department || 'Team'}) has requested to swap desks with you.
                </p>
                {req.details?.reason && (
                  <p className="text-[11px] text-slate-600 italic">
                    Reason: "{req.details.reason}"
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleConsentAction(req.id, 'ACCEPT')}
                  disabled={isRespondingConsent}
                  className="py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Agree & Accept Swap
                </button>
                <button
                  type="button"
                  onClick={() => handleConsentAction(req.id, 'REJECT')}
                  disabled={isRespondingConsent}
                  className="py-1.5 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-white font-medium text-xs transition-colors cursor-pointer"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Workstation Details
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            {currentSeat ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Assigned Desk
                  </div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5 font-mono">
                    {currentSeat.seat_number}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
                    <span>Floor {currentSeat.floor_id}</span>
                    <span>•</span>
                    <span className="capitalize">{currentSeat.seat_type}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>Employee Code: <span className="text-slate-800 font-medium">{employee?.employee_code || '—'}</span></div>
                  <div>Department: <span className="text-slate-800 font-medium">{employee?.department || '—'}</span></div>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 space-y-1.5">
                <p className="text-xs font-medium text-slate-700">No seat assigned currently</p>
                <p className="text-[11px] text-slate-400">
                  Submit a request to have a seat assigned by your manager and ops team.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => openActionModal('SEAT_CHANGE')}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Request Relocation or Swap
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Assigned Hardware & Assets ({myAssets.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => openActionModal('ASSET_NEW')}
                className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
              >
                + Request Equipment
              </button>
            </div>

            {isAssetsLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading your assets...</div>
            ) : myAssets.length === 0 ? (
              <div className="p-5 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 space-y-1.5">
                <p className="text-xs font-medium text-slate-700">No equipment currently assigned</p>
                <p className="text-[11px] text-slate-400">
                  Click 'Request Equipment' to order a monitor, mouse, headset, or charger.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 card-scroll pr-1">
                {myAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            {asset.asset_type}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {asset.asset_code}
                          </div>
                        </div>
                        <Badge status={asset.status} />
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        {asset.model_name && <div>Model: <span className="text-slate-700 font-medium">{asset.model_name}</span></div>}
                        {asset.serial_number && <div>S/N: <span className="text-slate-700 font-mono text-[10px]">{asset.serial_number}</span></div>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2.5 mt-2.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => openActionModal('ASSET_MAINTENANCE', asset)}
                        className="flex-1 py-1 px-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        Report Issue
                      </button>
                      <button
                        type="button"
                        onClick={() => openActionModal('ASSET_REPLACEMENT', asset)}
                        className="flex-1 py-1 px-2 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              My Request History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Track seating moves, hardware allocations, and maintenance requests
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            {(['ALL', 'PENDING', 'RESOLVED'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setRequestFilter(tab)}
                className={`py-1 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  requestFilter === tab
                    ? 'bg-zinc-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab === 'PENDING' ? 'Pending' : 'Resolved'}
              </button>
            ))}
          </div>
        </div>

        {isRequestsLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No requests found in this view
          </div>
        ) : (
          <div className="table-scroll">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">ID</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Details</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                  <th className="px-4 py-2.5">Workflow Progress</th>
                  <th className="px-4 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-500">#{r.id}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {r.request_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs space-y-0.5">
                      {r.asset_type && (
                        <div className="text-slate-800 font-medium">
                          Asset: {r.asset_type} {r.asset_code ? `(${r.asset_code})` : ''}
                        </div>
                      )}
                      {r.details?.preferred_seat_id && (
                        <div className="text-slate-700 font-medium text-[11px]">
                          Target Desk: #{r.details.preferred_seat_id}
                        </div>
                      )}
                      {r.details?.target_employee_name && (
                        <div className="text-slate-700 font-medium text-[11px]">
                          Swap with: {r.details.target_employee_name}
                        </div>
                      )}
                      {r.details?.reason && (
                        <div className="text-slate-500 truncate text-[11px]">"{r.details.reason}"</div>
                      )}
                      {r.rejected_reason && (
                        <div className="text-[11px] text-rose-600 italic">
                          Rejection: {r.rejected_reason}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge status={r.status} showDot />
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px]">
                      {r.approver_name && <div>Approved by: {r.approver_name}</div>}
                      {r.executor_name && <div>Executed by: {r.executor_name}</div>}
                      {!r.approver_name && !r.executor_name && <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EmployeeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assignedAssets={myAssets}
        initialMode={modalMode}
        preselectedAsset={selectedAsset}
      />
    </div>
  )
}

export default EmployeeDashboard
