import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  useGetAllSeatRequestsQuery,
  useGetApprovedSeatRequestsQuery,
  useGetMySeatRequestsQuery,
  useGetTeamSeatRequestsQuery,
} from '../../store/api/seatRequestApi'
import { useGetMeQuery } from '../../store/api/baseApi'
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from '../../store/api/notificationApi'
import type { SeatRequest } from '../../types'
import { SeatRequestTable } from '../../components/seatRequest/SeatRequestTable'
import { SeatRequestModal } from '../../components/seatRequest/SeatRequestModal'
import { SeatRequestReviewModal } from '../../components/seatRequest/SeatRequestReviewModal'
import { SeatRequestExecuteModal } from '../../components/seatRequest/SeatRequestExecuteModal'

export const SeatRequestsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryAction = searchParams.get('action')
  const querySeatId = searchParams.get('seatId') ? Number(searchParams.get('seatId')) : null
  const querySeatNumber = searchParams.get('seatNumber') || ''
  const queryType = (searchParams.get('type') as any) || 'RELOCATION'

  const { data: currentUser } = useGetMeQuery()
  const roleName = currentUser?.role || ''
  const isManager = roleName === 'Manager' || roleName === 'Admin'
  const isAdmin = roleName === 'Admin'

  const [activeTab, setActiveTab] = useState<
    'my' | 'team' | 'ops_seating' | 'it_asset' | 'all'
  >(isManager && !isAdmin ? 'team' : isAdmin ? 'ops_seating' : 'my')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean(queryAction === 'new' || querySeatId))
  const [reviewRequest, setReviewRequest] = useState<{
    req: SeatRequest
    action: 'APPROVE' | 'REJECT'
  } | null>(null)
  const [executeRequest, setExecuteRequest] = useState<SeatRequest | null>(null)

  useEffect(() => {
    if (queryAction === 'new' || querySeatId) {
      setIsCreateModalOpen(true)
    }
  }, [queryAction, querySeatId])

  const { data: myRequests = [], isLoading: isMyLoading } = useGetMySeatRequestsQuery(undefined, {
    pollingInterval: 10000,
  })
  const { data: teamRequests = [], isLoading: isTeamLoading } = useGetTeamSeatRequestsQuery(
    undefined,
    { skip: !isManager, pollingInterval: 10000 }
  )
  const { data: approvedRequests = [], isLoading: isApprovedLoading } =
    useGetApprovedSeatRequestsQuery(undefined, { skip: !isAdmin, pollingInterval: 10000 })
  const { data: allRequests = [], isLoading: isAllLoading } = useGetAllSeatRequestsQuery(
    undefined,
    { skip: !isAdmin, pollingInterval: 10000 }
  )

  const { data: notifData } = useGetNotificationsQuery(undefined, { pollingInterval: 10000 })
  const [markAllRead] = useMarkAllNotificationsReadMutation()
  const unreadNotifCount = notifData?.unread_count || 0

  const pendingTeamApprovals = teamRequests.filter((r) => r.status === 'PENDING')
  const opsSeatingApproved = approvedRequests.filter(
    (r) =>
      r.request_type === 'NEW_SEAT' ||
      r.request_type === 'RELOCATION' ||
      r.request_type === 'SWAP'
  )
  const itAssetApproved = approvedRequests.filter(
    (r) =>
      r.request_type === 'ASSET_NEW' ||
      r.request_type === 'ASSET_MAINTENANCE' ||
      r.request_type === 'ASSET_REPLACEMENT'
  )

  const handleReview = (req: SeatRequest, action: 'APPROVE' | 'REJECT') => {
    setReviewRequest({ req, action })
  }

  const handleExecute = (req: SeatRequest) => {
    setExecuteRequest(req)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isAdmin
              ? 'Requests & Operational Queues'
              : isManager
              ? 'Requests & Team Approvals'
              : 'My Requests & History'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdmin
              ? 'Execute approved seating relocations and asset allocations across departments.'
              : isManager
              ? 'Review pending approvals from your direct team and submit team relocation requests.'
              : 'Track the status and approvals of your seating and asset requests.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="py-2 px-3.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
        >
          <span>+ New Request</span>
        </button>
      </div>

      {unreadNotifCount > 0 && (
        <div className="bg-orange-50 border border-orange-200/90 rounded-xl px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-800">
              You have {unreadNotifCount} unread request & approval notification{unreadNotifCount > 1 ? 's' : ''}.
            </span>
          </div>
          <button
            type="button"
            onClick={() => markAllRead()}
            className="text-xs font-semibold text-orange-600 hover:text-orange-800 hover:underline cursor-pointer"
          >
            Mark all read
          </button>
        </div>
      )}

      <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto">
        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() => setActiveTab('ops_seating')}
              className={`py-2.5 px-3.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'ops_seating'
                  ? 'border-orange-600 text-orange-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Admin/Ops Seating ({opsSeatingApproved.length})</span>
              {opsSeatingApproved.length > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('it_asset')}
              className={`py-2.5 px-3.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'it_asset'
                  ? 'border-orange-600 text-orange-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Admin/IT Asset ({itAssetApproved.length})</span>
              {itAssetApproved.length > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          </>
        )}

        {isManager && (
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`py-2.5 px-3.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'team'
                ? 'border-orange-600 text-orange-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending Approvals ({pendingTeamApprovals.length})</span>
            {pendingTeamApprovals.length > 0 && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('my')}
          className={`py-2.5 px-3.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'my'
              ? 'border-orange-600 text-orange-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          My Requests ({myRequests.length})
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-2.5 px-3.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'border-orange-600 text-orange-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            All System Requests ({allRequests.length})
          </button>
        )}
      </div>

      <div>
        {activeTab === 'ops_seating' && isAdmin && (
          <div>
            {isApprovedLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading ops seating queue...
              </div>
            ) : (
              <SeatRequestTable
                requests={opsSeatingApproved}
                isAdminView
                onExecute={handleExecute}
              />
            )}
          </div>
        )}

        {activeTab === 'it_asset' && isAdmin && (
          <div>
            {isApprovedLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading IT asset queue...
              </div>
            ) : (
              <SeatRequestTable
                requests={itAssetApproved}
                isAdminView
                onExecute={handleExecute}
              />
            )}
          </div>
        )}

        {activeTab === 'team' && isManager && (
          <div>
            {isTeamLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading team requests...
              </div>
            ) : (
              <SeatRequestTable
                requests={teamRequests}
                isManagerView
                onReview={handleReview}
              />
            )}
          </div>
        )}

        {activeTab === 'my' && (
          <div>
            {isMyLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading requests...</div>
            ) : (
              <SeatRequestTable requests={myRequests} />
            )}
          </div>
        )}

        {activeTab === 'all' && isAdmin && (
          <div>
            {isAllLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading all requests...
              </div>
            ) : (
              <SeatRequestTable requests={allRequests} />
            )}
          </div>
        )}
      </div>

      <SeatRequestModal
        key={isCreateModalOpen ? `seat-req-page-${querySeatId || 'none'}` : 'closed'}
        isOpen={isCreateModalOpen}
        initialSeat={querySeatId ? { id: querySeatId, seat_number: querySeatNumber || `Desk #${querySeatId}` } : null}
        initialType={queryType}
        onClose={() => {
          setIsCreateModalOpen(false)
          if (queryAction || querySeatId) {
            setSearchParams({})
          }
        }}
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
