import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserManagement } from './useUserManagement'
import {
  UserAssignModal,
  UserCsvModal,
  UserProvisionModal,
  UserTable,
} from '../../components/user'
import {
  NotificationBanner,
  PageHeader,
  SearchBar,
  TableCard,
} from '../../components/common'

export const UserManagement: React.FC = () => {
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const {
    isAdmin,
    users,
    roles,
    employees,
    rawCount,
    isLoading,
    fetchError,
    searchTerm,
    setSearchTerm,
    actionError,
    actionSuccess,
    setActionError,
    setActionSuccess,
    handleRoleChange,
    handleToggleActive,
    assignModalUser,
    openAssignModal,
    closeAssignModal,
    selectedEmployeeId,
    setSelectedEmployeeId,
    handleSaveEmployeeLink,
    modalError,
    isSubmitting,
    provisionModalOpen,
    openProvisionModal,
    closeProvisionModal,
    handleProvisionUser,
    provisionError,
    isProvisioning,
    csvModalOpen,
    setCsvModalOpen,
  } = useUserManagement()

  const handleCopyOid = (userId: number, oid: string) => {
    navigator.clipboard.writeText(oid)
    setCopiedId(userId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Access & Role Management"
        subtitle="Control application permissions, local roles, and link SSO users with employee profiles."
        action={
          isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCsvModalOpen(true)}
                className="inline-flex items-center justify-center px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                Bulk CSV Provision
              </button>
              <button
                type="button"
                onClick={openProvisionModal}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
              >
                + Provision User
              </button>
            </div>
          )
        }
      />

      <NotificationBanner
        successMessage={actionSuccess}
        errorMessage={actionError}
        onClearSuccess={() => setActionSuccess(null)}
        onClearError={() => setActionError(null)}
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search email, role, employee name, SSO OID..."
        totalCount={rawCount}
        filteredCount={users.length}
        itemLabel="users"
      />

      <TableCard
        isLoading={isLoading}
        loadingMessage="Loading user accounts..."
        error={fetchError}
        isEmpty={users.length === 0}
        emptyTitle="No users found"
        emptyDescription={
          searchTerm
            ? 'Try adjusting your search criteria.'
            : 'Users will appear here once provisioned in the database.'
        }
        emptyAction={
          isAdmin && !searchTerm && (
            <button
              type="button"
              onClick={openProvisionModal}
              className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              + Provision First User
            </button>
          )
        }
      >
        <UserTable
          users={users}
          roles={roles}
          copiedId={copiedId}
          onCopyOid={handleCopyOid}
          onRoleChange={handleRoleChange}
          onViewEmployee={(term) =>
            navigate(`/employees?search=${encodeURIComponent(term)}`)
          }
          onOpenAssignModal={openAssignModal}
          onToggleActive={handleToggleActive}
        />
      </TableCard>

      <UserProvisionModal
        isOpen={provisionModalOpen}
        onClose={closeProvisionModal}
        employees={employees}
        roles={roles}
        onSubmit={handleProvisionUser}
        isSubmitting={isProvisioning}
        error={provisionError}
      />

      <UserCsvModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onSuccess={(count) => {
          setActionSuccess(`Successfully provisioned ${count} users from CSV.`)
        }}
      />

      <UserAssignModal
        isOpen={Boolean(assignModalUser)}
        onClose={closeAssignModal}
        user={assignModalUser}
        employees={employees}
        selectedEmployeeId={selectedEmployeeId}
        onEmployeeSelect={setSelectedEmployeeId}
        onSave={handleSaveEmployeeLink}
        modalError={modalError}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
