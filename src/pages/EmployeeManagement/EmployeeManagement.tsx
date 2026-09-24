import {
  EmployeeCsvModal,
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
    csvModalOpen,
    setCsvModalOpen,
    openCreateModal,
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
                onClick={openCreateModal}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
              >
                + Add Employee
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
            : 'Get started by creating your organization’s first employee.'
        }
        emptyAction={
          isAdmin && !searchTerm && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              + Add Employee
            </button>
          )
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

      <EmployeeCsvModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onSuccess={(count) => {
          setActionSuccess(`Successfully imported ${count} employees from CSV.`)
        }}
      />
    </div>
  )
}
