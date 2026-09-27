import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTeamManagement } from './useTeamManagement'
import {
  TeamDetailModal,
  TeamFormModal,
  TeamRequirementNotice,
  TeamTable,
} from '../../components/team'
import {
  ConfirmDialog,
  NotificationBanner,
  PageHeader,
  SearchBar,
  TableCard,
} from '../../components/common'
import type { Team, TeamMember } from '../../types'

export const TeamManagement: React.FC = () => {
  const {
    isAdmin,
    isManager,
    teams,
    rawCount,
    employees,
    hasEmployees,
    isLoading,
    fetchError,
    searchTerm,
    setSearchTerm,
    modalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    editingTeam,
    name,
    setName,
    department,
    setDepartment,
    managerId,
    setManagerId,
    formError,
    actionError,
    actionSuccess,
    setActionError,
    setActionSuccess,
    isSubmitting,
    deleteConfirmId,
    setDeleteConfirmId,
    handleDelete,
    isDeleting,
    selectedTeamForDetails,
    openDetailModal,
    closeDetailModal,
    handleAddMembers,
    handleRemoveMember,
  } = useTeamManagement()

  const [activeTab, setActiveTab] = useState<'SEATING' | 'DIRECTORY'>('SEATING')

  const totalMembers = teams.reduce((acc, t) => acc + (t.member_count || 0), 0)
  const seatedMembersCount = teams.reduce(
    (acc, t) => acc + (t.members ? t.members.filter((m) => !!m.seat_number).length : 0),
    0
  )
  const unassignedMembersCount = Math.max(0, totalMembers - seatedMembersCount)

  return (
    <div className="space-y-6">
      <PageHeader
        title={!isAdmin ? 'Team Seating & Workforce Roster' : 'Team Management'}
        subtitle={
          !isAdmin
            ? 'Monitor team members, desk allocations, and departmental workstation distribution.'
            : 'Organize departments, project teams, and assign team managers.'
        }
        action={
          <div className="flex items-center gap-2">
            <Link
              to="/seats"
              className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            >
              Open Seating Map
            </Link>
            {isAdmin && (
              <button
                type="button"
                disabled={!hasEmployees}
                onClick={openCreateModal}
                title={!hasEmployees ? 'Create an employee first to assign as manager' : ''}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Team
              </button>
            )}
          </div>
        }
      />

      {!hasEmployees && !isLoading && <TeamRequirementNotice />}

      <NotificationBanner
        successMessage={actionSuccess}
        errorMessage={actionError}
        onClearSuccess={() => setActionSuccess(null)}
        onClearError={() => setActionError(null)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Teams
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {teams.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Managed departments</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Team Members
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">
            {totalMembers}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Total active headcount</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Assigned Desks
          </span>
          <span className="text-xl font-bold text-orange-600 mt-1 block">
            {seatedMembersCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Workstations allocated</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Unassigned
          </span>
          <span className="text-xl font-bold text-slate-700 mt-1 block">
            {unassignedMembersCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Pending desk assignment</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('SEATING')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'SEATING'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Team Seating Roster
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('DIRECTORY')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'DIRECTORY'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Teams Directory ({teams.length})
        </button>
      </div>

      {activeTab === 'SEATING' ? (
        <div className="space-y-6">
          {teams.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-700">No teams found</h3>
              <p className="text-xs text-slate-400 mt-1">Teams and their seating allocations will be listed here.</p>
            </div>
          ) : (
            teams.map((team: Team) => {
              const members = team.members || []
              return (
                <div
                  key={team.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden"
                >
                  <div className="bg-slate-50/80 p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h3 className="text-sm font-bold text-slate-900">
                          {team.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 uppercase tracking-wide">
                          {team.department}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {members.length} {members.length === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>Lead: <strong className="text-slate-800">{team.manager_name || 'Unassigned'}</strong></span>
                        {team.manager_seat_number && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                            Manager Desk: {team.manager_seat_number}
                          </span>
                        )}
                        {team.manager_email && (
                          <span className="text-slate-400 text-[11px]">· {team.manager_email}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openDetailModal(team)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Manage Roster
                      </button>
                      <Link
                        to="/seats"
                        className="px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      >
                        View on Map
                      </Link>
                    </div>
                  </div>

                  <div className="table-scroll">
                    {members.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No employees currently assigned to this team.
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-white text-[11px] uppercase font-semibold text-slate-400 border-b border-slate-100 tracking-wider">
                          <tr>
                            <th className="px-5 py-2.5">Employee</th>
                            <th className="px-5 py-2.5">Code</th>
                            <th className="px-5 py-2.5">Designation</th>
                            <th className="px-5 py-2.5">Current Seating Desk</th>
                            <th className="px-5 py-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {members.map((m: TeamMember) => {
                            const initials = `${m.first_name[0] || ''}${m.last_name[0] || ''}`.toUpperCase()
                            return (
                              <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-5 py-3">
                                  <div className="flex items-center space-x-2.5">
                                    <div className="w-7 h-7 rounded-md bg-zinc-800 text-white font-semibold flex items-center justify-center text-[10px] shrink-0">
                                      {initials}
                                    </div>
                                    <div>
                                      <div className="font-semibold text-slate-900">
                                        {m.first_name} {m.last_name}
                                      </div>
                                      <div className="text-[11px] text-slate-400">
                                        {m.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-700">
                                  {m.employee_code}
                                </td>
                                <td className="px-5 py-3 text-slate-800 font-medium">
                                  {m.designation || 'Staff'}
                                </td>
                                <td className="px-5 py-3">
                                  {m.seat_number ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                                      Desk {m.seat_number}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-400 bg-slate-50 border border-slate-200 italic">
                                      Unassigned Desk
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-3 text-right">
                                  <Link
                                    to="/seats"
                                    className="text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
                                  >
                                    Locate on Map
                                  </Link>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search teams, departments, managers..."
            totalCount={rawCount}
            filteredCount={teams.length}
            itemLabel="teams"
          />

          <TableCard
            isLoading={isLoading}
            loadingMessage="Loading teams..."
            error={fetchError}
            isEmpty={teams.length === 0}
            emptyTitle="No teams found"
            emptyDescription={
              !hasEmployees
                ? 'Create an employee first before you can set up a team and assign a manager.'
                : searchTerm
                ? 'No teams match your search.'
                : 'Start organizing your workforce into departments and project teams.'
            }
            emptyAction={
              isAdmin && hasEmployees && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer"
                >
                  + Create Team
                </button>
              )
            }
          >
            <TeamTable
              teams={teams}
              isAdmin={isAdmin}
              onOpenTeam={openDetailModal}
              onEdit={openEditModal}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          </TableCard>
        </>
      )}

      <TeamDetailModal
        isOpen={selectedTeamForDetails !== null}
        onClose={closeDetailModal}
        team={selectedTeamForDetails}
        allEmployees={employees}
        isAdmin={isAdmin}
        isManager={isManager}
        onEditTeam={(t) => {
          closeDetailModal()
          openEditModal(t)
        }}
        onAddMembers={handleAddMembers}
        onRemoveMember={handleRemoveMember}
      />

      <TeamFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingTeam={editingTeam}
        name={name}
        setName={setName}
        department={department}
        setDepartment={setDepartment}
        managerId={managerId}
        setManagerId={setManagerId}
        employees={employees}
        formError={formError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
        title="Confirm Delete Team"
        message="Are you sure you want to delete this team? If any employees are currently assigned to this team, deletion will be rejected."
        confirmText="Delete"
        loadingText="Deleting..."
        isLoading={isDeleting}
      />
    </div>
  )
}

export default TeamManagement
