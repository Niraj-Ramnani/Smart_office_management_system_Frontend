import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { RootState } from '../../store/store'
import {
  useAssignUserEmployeeMutation,
  useGetRolesQuery,
  useGetUsersQuery,
  useProvisionUserMutation,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from '../../store/api/userManagementApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'
import type { UserManagement, UserProvisionPayload } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { useActionFeedback, useEntityModal } from '../../hooks'

export const useUserManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin = user?.role === 'Admin'

  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''

  const handleSearchChange = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    setSearchParams(params)
  }

  const { data: users = [], isLoading, error: fetchError, refetch } = useGetUsersQuery()
  const { data: roles = [] } = useGetRolesQuery()
  const { data: employees = [] } = useGetEmployeesQuery()

  const [provisionUserMutation, { isLoading: isProvisioning }] = useProvisionUserMutation()
  const [assignEmployee, { isLoading: isAssigning }] = useAssignUserEmployeeMutation()
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation()
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation()

  const modal = useEntityModal<UserManagement>()
  const feedback = useActionFeedback()

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [provisionModalOpen, setProvisionModalOpen] = useState(false)
  const [provisionError, setProvisionError] = useState<string | null>(null)
  const [csvModalOpen, setCsvModalOpen] = useState(false)

  const handleOpenProvisionModal = () => {
    setProvisionError(null)
    setProvisionModalOpen(true)
  }

  const handleCloseProvisionModal = () => {
    setProvisionError(null)
    setProvisionModalOpen(false)
  }

  const handleProvisionUser = async (payload: UserProvisionPayload) => {
    setProvisionError(null)
    feedback.clearFeedback()
    try {
      const res = await provisionUserMutation(payload).unwrap()
      feedback.notifySuccess(`User '${res.email}' successfully provisioned`)
      handleCloseProvisionModal()
    } catch (err) {
      setProvisionError(extractErrorMessage(err, 'Failed to provision user'))
    }
  }

  const openAssignModal = (u: UserManagement) => {
    setSelectedEmployeeId(u.employee_id)
    modal.openEdit(u)
  }

  const closeAssignModal = () => {
    modal.close()
    setSelectedEmployeeId(null)
  }

  const handleSaveEmployeeLink = async () => {
    if (!modal.editingItem) return
    modal.setFormError(null)
    feedback.clearFeedback()

    try {
      await assignEmployee({
        userId: modal.editingItem.id,
        employeeId: selectedEmployeeId,
      }).unwrap()
      feedback.notifySuccess(`Employee link updated for user '${modal.editingItem.email}'`)
      closeAssignModal()
    } catch (err) {
      modal.setFormError(extractErrorMessage(err, 'Failed to link employee'))
    }
  }

  const handleRoleChange = async (userId: number, roleName: string) => {
    feedback.clearFeedback()
    try {
      await updateRole({ userId, roleName }).unwrap()
      feedback.notifySuccess(`Role updated to '${roleName}'`)
    } catch (err) {
      feedback.notifyError(err, 'Failed to update role')
    }
  }

  const handleToggleActive = async (userId: number, currentActive: boolean) => {
    feedback.clearFeedback()
    try {
      await updateStatus({ userId, isActive: !currentActive }).unwrap()
      feedback.notifySuccess(`User status ${!currentActive ? 'activated' : 'deactivated'} successfully`)
    } catch (err) {
      feedback.notifyError(err, 'Failed to toggle status')
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.employee_name && u.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.sso_user_id && u.sso_user_id.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return {
    isAdmin,
    users: filteredUsers,
    roles,
    employees,
    rawCount: users.length,
    isLoading,
    fetchError: fetchError ? extractErrorMessage(fetchError) : null,
    refetch,
    searchTerm,
    setSearchTerm: handleSearchChange,
    actionError: feedback.actionError,
    actionSuccess: feedback.actionSuccess,
    setActionError: feedback.setActionError,
    setActionSuccess: feedback.setActionSuccess,
    handleRoleChange,
    handleToggleActive,
    assignModalUser: modal.editingItem,
    openAssignModal,
    closeAssignModal,
    selectedEmployeeId,
    setSelectedEmployeeId,
    handleSaveEmployeeLink,
    modalError: modal.formError,
    isSubmitting: isAssigning || isUpdatingRole || isUpdatingStatus,
    provisionModalOpen,
    setProvisionModalOpen,
    openProvisionModal: handleOpenProvisionModal,
    closeProvisionModal: handleCloseProvisionModal,
    handleProvisionUser,
    provisionError,
    isProvisioning,
    csvModalOpen,
    setCsvModalOpen,
  }
}
