import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserManagement } from './useUserManagement'
import {
  UserTable,
} from '../../components/user'
import {
  EmployeeCsvModal,
  EmployeeFormModal,
} from '../../components/employee'
import {
  NotificationBanner,
  PageHeader,
  SearchBar,
  TableCard,
} from '../../components/common'

export const UserManagement: React.FC = () => {
  const navigate = useNavigate()

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
    teams,
    onboardModalOpen,
    openOnboardModal,
    closeOnboardModal,
    handleOnboardSubmit,
    isOnboarding,
    onboardError,
    csvModalOpen,
    setCsvModalOpen,
    handleCsvSuccess,
    employeeCode,
    setEmployeeCode,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    designation,
    setDesignation,
    department,
    setDepartment,
    employmentType,
    setEmploymentType,
    employeeStatus,
    setEmployeeStatus,
    managerId,
    setManagerId,
    teamId,
    setTeamId,
    roleName,
    setRoleName,
  } = useUserManagement()

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Access & Role Management"
        subtitle="Manage application roles, account activation, and user permissions. Onboard new employees and users directly here."
        action={
          isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCsvModalOpen(true)}
                className="inline-flex items-center justify-center px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              >
                Bulk CSV Import
              </button>
              <button
                type="button"
                onClick={openOnboardModal}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 shadow-sm transition-colors cursor-pointer"
              >
                + Onboard / Add User
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
        placeholder="Search email, role, employee name..."
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
            : 'Users will appear here once onboarded or authenticated via Microsoft Entra SSO.'
        }
        emptyAction={
          isAdmin && !searchTerm && (
            <button
              type="button"
              onClick={openOnboardModal}
              className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer"
            >
              + Onboard First User
            </button>
          )
        }
      >
        <UserTable
          users={users}
          roles={roles}
          onRoleChange={handleRoleChange}
          onViewEmployee={(term) =>
            navigate(`/employees?search=${encodeURIComponent(term)}`)
          }
          onToggleActive={handleToggleActive}
        />
      </TableCard>

      <EmployeeFormModal
        isOpen={onboardModalOpen}
        onClose={closeOnboardModal}
        editingEmployee={null}
        formError={onboardError}
        isSubmitting={isOnboarding}
        onSubmit={handleOnboardSubmit}
        employeeCode={employeeCode}
        setEmployeeCode={setEmployeeCode}
        employmentType={employmentType}
        setEmploymentType={setEmploymentType}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        designation={designation}
        setDesignation={setDesignation}
        department={department}
        setDepartment={setDepartment}
        teamId={teamId}
        setTeamId={setTeamId}
        teams={teams}
        managerId={managerId}
        setManagerId={setManagerId}
        employees={employees}
        employeeStatus={employeeStatus}
        setEmployeeStatus={setEmployeeStatus}
        roleName={roleName}
        setRoleName={setRoleName}
      />

      <EmployeeCsvModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onSuccess={handleCsvSuccess}
      />
    </div>
  )
}
