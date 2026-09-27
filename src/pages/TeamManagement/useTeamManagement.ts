import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import {
  useAddTeamMembersMutation,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamsQuery,
  useRemoveTeamMemberMutation,
  useUpdateTeamMutation,
} from '../../store/api/teamApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'
import type { Team } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { useActionFeedback, useConfirmDialog, useEntityModal } from '../../hooks'

export const useTeamManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin = user?.role === 'Admin'
  const isManager = user?.role === 'Manager'

  const { data: teams = [], isLoading, error: fetchError, refetch } = useGetTeamsQuery()
  const { data: employees = [], isLoading: isLoadingEmployees } = useGetEmployeesQuery()

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation()
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation()
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation()
  const [addTeamMembers] = useAddTeamMembersMutation()
  const [removeTeamMember] = useRemoveTeamMemberMutation()

  const [searchTerm, setSearchTerm] = useState('')
  const [detailTeamId, setDetailTeamId] = useState<number | null>(null)
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

  const openDetailModal = (t: Team) => {
    setDetailTeamId(t.id)
  }

  const closeDetailModal = () => {
    setDetailTeamId(null)
  }

  const handleAddMembers = async (teamId: number, employeeIds: number[]) => {
    feedback.clearFeedback()
    try {
      await addTeamMembers({ teamId, employeeIds }).unwrap()
      feedback.notifySuccess(
        `Added ${employeeIds.length} member${employeeIds.length === 1 ? '' : 's'} to team`
      )
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to add members to team')
      feedback.setActionError(msg)
      throw new Error(msg)
    }
  }

  const handleRemoveMember = async (teamId: number, employeeId: number) => {
    feedback.clearFeedback()
    try {
      await removeTeamMember({ teamId, employeeId }).unwrap()
      feedback.notifySuccess('Member removed from team')
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to remove member from team')
      feedback.setActionError(msg)
      throw new Error(msg)
    }
  }

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.manager_name && t.manager_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const selectedTeamForDetails = detailTeamId
    ? teams.find((t) => t.id === detailTeamId) || null
    : null

  return {
    isAdmin,
    isManager,
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
    selectedTeamForDetails,
    openDetailModal,
    closeDetailModal,
    handleAddMembers,
    handleRemoveMember,
  }
}

