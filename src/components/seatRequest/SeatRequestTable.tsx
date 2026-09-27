import React from 'react'
import type { SeatRequest } from '../../types'
import { Badge } from '../common/Badge'

interface SeatRequestTableProps {
  requests: SeatRequest[]
  isManagerView?: boolean
  isAdminView?: boolean
  onReview?: (req: SeatRequest, action: 'APPROVE' | 'REJECT') => void
  onExecute?: (req: SeatRequest) => void
}

export const SeatRequestTable: React.FC<SeatRequestTableProps> = ({
  requests,
  isManagerView = false,
  isAdminView = false,
  onReview,
  onExecute,
}) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-xs">
        <p className="text-slate-400 text-xs font-medium">No requests found in this list.</p>
      </div>
    )
  }

  const formatRequestType = (type: string) => {
    switch (type) {
      case 'NEW_SEAT':
        return 'New Desk'
      case 'RELOCATION':
        return 'Relocation'
      case 'SWAP':
        return 'Seat Swap'
      case 'ASSET_NEW':
        return 'Asset Request'
      case 'ASSET_MAINTENANCE':
        return 'Maintenance'
      case 'ASSET_REPLACEMENT':
        return 'Replacement'
      default:
        return type
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="table-scroll">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200 tracking-wider">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Employee</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Request Details</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3">Workflow State</th>
              <th className="px-5 py-3">Date</th>
              {(isManagerView || isAdminView) && (
                <th className="px-5 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-500">
                  #{r.id}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-slate-900">{r.employee_name}</div>
                  <div className="text-[11px] text-slate-400">
                    {r.employee_code} · {r.department}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {formatRequestType(r.request_type)}
                  </span>
                </td>
                <td className="px-5 py-3.5 max-w-xs space-y-0.5">
                  {r.asset_type && (
                    <div className="text-slate-900 font-medium">
                      {r.asset_type} {r.asset_code ? `(${r.asset_code})` : ''}
                    </div>
                  )}
                  {r.details?.preferred_seat_id && (
                    <div className="text-[11px] text-slate-700 font-medium">
                      Target: Desk #{r.details.preferred_seat_id}
                    </div>
                  )}
                  {r.details?.target_employee_name && (
                    <div className="text-[11px] text-slate-700 font-medium">
                      Swap with: {r.details.target_employee_name}
                    </div>
                  )}
                  {r.details?.consent_status && (
                    <div className="text-[10px] text-slate-500">
                      Consent: <span className="font-semibold">{r.details.consent_status}</span>
                    </div>
                  )}
                  {r.details?.reason && (
                    <div className="text-slate-600 truncate text-[11px]">"{r.details.reason}"</div>
                  )}
                  {r.rejected_reason && (
                    <div className="text-[11px] text-rose-600 italic">
                      Rejection: {r.rejected_reason}
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <Badge status={r.status} showDot />
                </td>
                <td className="px-5 py-3.5 text-slate-600 text-[11px]">
                  {r.details?.target_employee_manager_id && (
                    <div className="text-[10px] text-slate-500 mb-0.5">
                      Mgr A: {r.details.manager_a_approved ? 'Approved' : 'Pending'} | Mgr B:{' '}
                      {r.details.manager_b_approved ? 'Approved' : 'Pending'}
                    </div>
                  )}
                  {r.approver_name && <div>Approved: {r.approver_name}</div>}
                  {r.executor_name && <div>Executed: {r.executor_name}</div>}
                  {!r.approver_name && !r.executor_name && !r.details?.target_employee_manager_id && (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                {(isManagerView || isAdminView) && (
                  <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    {isManagerView && r.status === 'PENDING' && onReview && (
                      <>
                        <button
                          type="button"
                          onClick={() => onReview(r, 'APPROVE')}
                          className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onReview(r, 'REJECT')}
                          className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {isAdminView && r.status === 'MANAGER_APPROVED' && onExecute && (
                      <button
                        type="button"
                        onClick={() => onExecute(r)}
                        className="px-3 py-1 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs transition-colors cursor-pointer"
                      >
                        Execute
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SeatRequestTable
