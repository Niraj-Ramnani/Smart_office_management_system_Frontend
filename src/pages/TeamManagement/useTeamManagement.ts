import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamsQuery,
  useUpdateTeamMutation,
} from '../../store/api/teamApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'
import type { Team } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { useActionFeedback, useConfirmDialog, useEntityModal } from '../../hooks'

export const useTeamManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin = user?.role === 'Admin'

  const { data: teams = [], isLoading, error: fetchError, refetch } = useGetTeamsQuery()
  const { data: employees = [], isLoading: isLoadingEmployees } = useGetEmployeesQuery()

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation()
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation()
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation()

  const [searchTerm, setSearchTerm] = useState('')
  const modal = useEntityModal<Team>()
  const confirm = useConfirmDialog<number>()
  const feedback = useActionFeedback()

  const [name, setName] = useState('')
  const [department, setDepartment] = useState('')
  const [managerId, setManagerId] = useState<number>(0)

  const openCreateModal = () => {
    setName('')
    setDepartment('')
    setManagerId(employees.length > 0 ? employees[0].id : 0)
    modal.openCreate()
  }

  const openEditModal = (t: Team) => {
    setName(t.name)
    setDepartment(t.department)
    setManagerId(t.manager_id)
    modal.openEdit(t)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    modal.setFormError(null)
    feedback.clearFeedback()

    if (!name.trim()) {
      modal.setFormError('Team name is required')
      return
    }
    if (!department.trim()) {
      modal.setFormError('Department is required')
      return
    }
    if (!managerId) {
      modal.setFormError('Selecting a manager is required. An employee must exist first.')
      return
    }

    try {
      if (modal.editingItem) {
        await updateTeam({
          id: modal.editingItem.id,
          name: name.trim(),
          department: department.trim(),
          manager_id: managerId,
        }).unwrap()
        feedback.notifySuccess(`Team '${name.trim()}' updated successfully`)
      } else {
        await createTeam({
          name: name.trim(),
          department: department.trim(),
          manager_id: managerId,
        }).unwrap()
        feedback.notifySuccess(`Team '${name.trim()}' created successfully`)
      }
      modal.close()
    } catch (err) {
      modal.setFormError(extractErrorMessage(err, 'Failed to save team'))
    }
  }

  const handleDelete = async (id: number) => {
    feedback.clearFeedback()
    try {
      const res = await deleteTeam(id).unwrap()
      feedback.notifySuccess(res.message || 'Team deleted successfully')
      confirm.closeConfirm()
    } catch (err) {
      feedback.notifyError(err, 'Failed to delete team')
      confirm.closeConfirm()
    }
  }

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.manager_name && t.manager_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return {
    isAdmin,
    teams: filteredTeams,
    rawCount: teams.length,
    employees,
    hasEmployees: employees.length > 0,
    isLoading: isLoading || isLoadingEmployees,
    fetchError: fetchError ? extractErrorMessage(fetchError) : null,
    refetch,
    searchTerm,
    setSearchTerm,
    modalOpen: modal.isOpen,
    openCreateModal,
    openEditModal,
    closeModal: modal.close,
    handleSubmit,
    editingTeam: modal.editingItem,
    name,
    setName,
    department,
    setDepartment,
    managerId,
    setManagerId,
    formError: modal.formError,
    actionError: feedback.actionError,
    actionSuccess: feedback.actionSuccess,
    setActionError: feedback.setActionError,
    setActionSuccess: feedback.setActionSuccess,
    isSubmitting: isCreating || isUpdating,
    deleteConfirmId: confirm.confirmTarget,
    setDeleteConfirmId: confirm.setConfirmTarget,
    handleDelete,
    isDeleting,
  }
}
