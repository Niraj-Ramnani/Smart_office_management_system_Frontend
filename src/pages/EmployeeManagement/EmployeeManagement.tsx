import {
  EmployeeFilterBar,
  EmployeeFormModal,
  EmployeeTable,
} from '../../components/employee'
import { useEmployeeManagement } from './useEmployeeManagement'
import {
  ConfirmDialog,
  NotificationBanner,
  PageHeader,
  TableCard,
} from '../../components/common'

export const EmployeeManagement: React.FC = () => {
  const {
    isAdmin,
    employees,
    teams,
    isLoading,
    fetchError,
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    selectedTeamId,
    setSelectedTeamId,
    selectedStatus,
    setSelectedStatus,
    modalOpen,
    openEditModal,
    closeModal,
    handleSubmit,
    editingEmployee,
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
    formError,
    actionError,
    actionSuccess,
    setActionError,
    setActionSuccess,
    isSubmitting,
    deactivateConfirmId,
    setDeactivateConfirmId,
    handleDeactivate,
    handleToggleStatus,
  } = useEmployeeManagement()

  const departments = Array.from(
    new Set(employees.map((e) => e.department).filter(Boolean))
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage organization staff, roles, reporting lines, and departmental teams."
      />

      <NotificationBanner
        successMessage={actionSuccess}
        errorMessage={actionError}
        onClearSuccess={() => setActionSuccess(null)}
        onClearError={() => setActionError(null)}
      />

      <EmployeeFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        departments={departments}
        selectedTeamId={selectedTeamId}
        onTeamChange={setSelectedTeamId}
        teams={teams}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <TableCard
        isLoading={isLoading}
        loadingMessage="Loading employees..."
        error={fetchError}
        isEmpty={employees.length === 0}
        emptyTitle="No employees found"
        emptyDescription={
          searchTerm || selectedDepartment || selectedTeamId || selectedStatus
            ? 'Try adjusting your filters to see more results.'
            : 'Employees will appear here once onboarded in Users & Roles or authenticated via SSO.'
        }
      >
        <EmployeeTable
          employees={employees}
          isAdmin={isAdmin}
          onEdit={openEditModal}
          onToggleStatus={handleToggleStatus}
          onDeactivate={(id) => setDeactivateConfirmId(id)}
        />
      </TableCard>

      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        editingEmployee={editingEmployee}
        formError={formError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
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

      <ConfirmDialog
        isOpen={deactivateConfirmId !== null}
        onClose={() => setDeactivateConfirmId(null)}
        onConfirm={() => deactivateConfirmId !== null && handleDeactivate(deactivateConfirmId)}
        title="Confirm Deactivation"
        message="Are you sure you want to deactivate this employee? Historical assignments, requests, and logs will be preserved."
        confirmText="Deactivate"
        loadingText="Deactivating..."
        isLoading={isSubmitting}
      />
    </div>
  )
}
