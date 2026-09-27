import React, { useState } from 'react'
import {
  useGetAllSeatRequestsQuery,
  useGetApprovedSeatRequestsQuery,
  useGetMySeatRequestsQuery,
  useGetTeamSeatRequestsQuery,
} from '../../store/api/seatRequestApi'
import { useGetMeQuery } from '../../store/api/baseApi'
import type { SeatRequest } from '../../types'
import { SeatRequestTable } from '../../components/seatRequest/SeatRequestTable'
import { SeatRequestModal } from '../../components/seatRequest/SeatRequestModal'
import { SeatRequestReviewModal } from '../../components/seatRequest/SeatRequestReviewModal'
import { SeatRequestExecuteModal } from '../../components/seatRequest/SeatRequestExecuteModal'

export const SeatRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'team' | 'execution' | 'all'>('my')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [reviewRequest, setReviewRequest] = useState<{
    req: SeatRequest
    action: 'APPROVE' | 'REJECT'
  } | null>(null)
  const [executeRequest, setExecuteRequest] = useState<SeatRequest | null>(null)

  const { data: currentUser } = useGetMeQuery()
  const roleName = currentUser?.role || ''
  const isManager = roleName === 'Manager' || roleName === 'Admin'
  const isAdmin = roleName === 'Admin'

  const { data: myRequests = [], isLoading: isMyLoading } = useGetMySeatRequestsQuery()
  const { data: teamRequests = [], isLoading: isTeamLoading } = useGetTeamSeatRequestsQuery(
    undefined,
    { skip: !isManager }
  )
  const { data: approvedRequests = [], isLoading: isApprovedLoading } =
    useGetApprovedSeatRequestsQuery(undefined, { skip: !isAdmin })
  const { data: allRequests = [], isLoading: isAllLoading } = useGetAllSeatRequestsQuery(
    undefined,
    { skip: !isAdmin }
  )

  const handleReview = (req: SeatRequest, action: 'APPROVE' | 'REJECT') => {
    setReviewRequest({ req, action })
  }

  const handleExecute = (req: SeatRequest) => {
    setExecuteRequest(req)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Seat Requests & Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Request seating adjustments, review employee submissions, and execute approved operations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-2"
        >
          <span>+ New Seat Request</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('my')}
          className={`py-3 px-4 text-xs font-bold transition border-b-2 ${
            activeTab === 'my'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Requests ({myRequests.length})
        </button>

        {isManager && (
          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'team'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Team Approvals ({teamRequests.filter((r) => r.status === 'PENDING').length})
          </button>
        )}

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('execution')}
              className={`py-3 px-4 text-xs font-bold transition border-b-2 ${
                activeTab === 'execution'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Ready to Execute ({approvedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-3 px-4 text-xs font-bold transition border-b-2 ${
                activeTab === 'all'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              All Requests ({allRequests.length})
            </button>
          </>
        )}
      </div>

      <div>
        {activeTab === 'my' && (
          <div>
            {isMyLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading requests...</div>
            ) : (
              <SeatRequestTable requests={myRequests} />
            )}
          </div>
        )}

        {activeTab === 'team' && isManager && (
          <div>
            {isTeamLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading team requests...</div>
            ) : (
              <SeatRequestTable
                requests={teamRequests}
                isManagerView
                onReview={handleReview}
              />
            )}
          </div>
        )}

        {activeTab === 'execution' && isAdmin && (
          <div>
            {isApprovedLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading approved requests...</div>
            ) : (
              <SeatRequestTable
                requests={approvedRequests}
                isAdminView
                onExecute={handleExecute}
              />
            )}
          </div>
        )}

        {activeTab === 'all' && isAdmin && (
          <div>
            {isAllLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading all requests...</div>
            ) : (
              <SeatRequestTable requests={allRequests} />
            )}
          </div>
        )}
      </div>

      <SeatRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <SeatRequestReviewModal
        request={reviewRequest?.req || null}
        action={reviewRequest?.action || null}
        isOpen={reviewRequest !== null}
        onClose={() => setReviewRequest(null)}
      />

      <SeatRequestExecuteModal
        request={executeRequest}
        isOpen={executeRequest !== null}
        onClose={() => setExecuteRequest(null)}
      />
    </div>
  )
}
export default SeatRequestsPage
