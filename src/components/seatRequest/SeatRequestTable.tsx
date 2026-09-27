import React from 'react'
import type { SeatRequest } from '../../types'

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
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs">
        <p className="text-slate-400 text-xs font-medium">No seat requests found in this list.</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Pending Manager
          </span>
        )
      case 'MANAGER_APPROVED':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Manager Approved
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Completed
          </span>
        )
      case 'REJECTED':
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Rejected
          </span>
        )
      default:
        return (
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="py-3 px-4 font-bold">ID</th>
              <th className="py-3 px-4 font-bold">Employee</th>
              <th className="py-3 px-4 font-bold">Type</th>
              <th className="py-3 px-4 font-bold">Details</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold">Approver / Ops</th>
              <th className="py-3 px-4 font-bold">Created</th>
              {(isManagerView || isAdminView) && <th className="py-3 px-4 font-bold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition">
                <td className="py-3 px-4 font-semibold text-slate-500">#{r.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800">{r.employee_name}</div>
                  <div className="text-[11px] text-slate-400">{r.employee_code} · {r.department}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-700">{r.request_type}</span>
                </td>
                <td className="py-3 px-4 max-w-xs">
                  {r.details?.reason && (
                    <div className="text-slate-600 truncate">{r.details.reason}</div>
                  )}
                  {r.details?.preferred_seat_id && (
                    <div className="text-[11px] text-orange-600 font-semibold">
                      Pref Seat: #{r.details.preferred_seat_id}
                    </div>
                  )}
                  {r.rejected_reason && (
                    <div className="text-[11px] text-red-600 italic">
                      Reason: {r.rejected_reason}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                <td className="py-3 px-4 text-slate-600">
                  {r.approver_name && <div>Appr: {r.approver_name}</div>}
                  {r.executor_name && <div>Exec: {r.executor_name}</div>}
                  {!r.approver_name && !r.executor_name && <span className="text-slate-400">—</span>}
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                {(isManagerView || isAdminView) && (
                  <td className="py-3 px-4 text-right space-x-2">
                    {isManagerView && r.status === 'PENDING' && onReview && (
                      <>
                        <button
                          onClick={() => onReview(r, 'APPROVE')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReview(r, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {isAdminView && r.status === 'MANAGER_APPROVED' && onExecute && (
                      <button
                        onClick={() => onExecute(r)}
                        className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] shadow-xs"
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
