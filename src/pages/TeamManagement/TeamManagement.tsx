import React from 'react'
import { useTeamManagement } from './useTeamManagement'
import {
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

export const TeamManagement: React.FC = () => {
  const {
    isAdmin,
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
  } = useTeamManagement()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Management"
        subtitle="Organize departments, project teams, and assign team managers."
        action={
          isAdmin && (
            <button
              type="button"
              disabled={!hasEmployees}
              onClick={openCreateModal}
              title={!hasEmployees ? 'Create an employee first to assign as manager' : ''}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Team
            </button>
          )
        }
      />

      {!hasEmployees && !isLoading && <TeamRequirementNotice />}

      <NotificationBanner
        successMessage={actionSuccess}
        errorMessage={actionError}
        onClearSuccess={() => setActionSuccess(null)}
        onClearError={() => setActionError(null)}
      />

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
              className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              + Create Team
            </button>
          )
        }
      >
        <TeamTable
          teams={teams}
          isAdmin={isAdmin}
          onEdit={openEditModal}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      </TableCard>

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
