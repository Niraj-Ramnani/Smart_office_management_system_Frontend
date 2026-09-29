import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { RootState } from '../../store/store'
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useUpdateEmployeeStatusMutation,
} from '../../store/api/employeeApi'
import { useGetTeamsQuery } from '../../store/api/teamApi'
import type { Employee } from '../../types'
import { extractErrorMessage } from '../../utils/authErrors'
import { useActionFeedback, useConfirmDialog, useEntityModal } from '../../hooks'

export const useEmployeeManagement = () => {
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

  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined)
  const [selectedStatus, setSelectedStatus] = useState('')

  const {
    data: employees = [],
    isLoading,
    error: fetchError,
    refetch,
  } = useGetEmployeesQuery({
    search: searchTerm || undefined,
    department: selectedDepartment || undefined,
    team_id: selectedTeamId,
    employee_status: selectedStatus || undefined,
  })

  const { data: teams = [] } = useGetTeamsQuery()

  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation()
  const [updateEmployeeStatus, { isLoading: isUpdatingStatus }] = useUpdateEmployeeStatusMutation()
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation()

  const modal = useEntityModal<Employee>()
  const confirm = useConfirmDialog<number>()
  const feedback = useActionFeedback()

  const [employeeCode, setEmployeeCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [designation, setDesignation] = useState('')
  const [department, setDepartment] = useState('')
  const [employmentType, setEmploymentType] = useState('Full-Time')
  const [employeeStatus, setEmployeeStatus] = useState('ACTIVE')
  const [managerId, setManagerId] = useState<number | undefined>(undefined)
  const [teamId, setTeamId] = useState<number | undefined>(undefined)
  const [roleName, setRoleName] = useState('Employee')

  const openEditModal = (emp: Employee) => {
    setEmployeeCode(emp.employee_code)
    setFirstName(emp.first_name)
    setLastName(emp.last_name)
    setEmail(emp.email)
    setPhone(emp.phone || '')
    setDesignation(emp.designation)
    setDepartment(emp.department)
    setEmploymentType(emp.employment_type)
    setEmployeeStatus(emp.employee_status)
    setManagerId(emp.manager_id || undefined)
    setTeamId(emp.team_id || undefined)
    setRoleName(emp.role_name || 'Employee')
    modal.openEdit(emp)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    modal.setFormError(null)
    feedback.clearFeedback()

    if (!employeeCode.trim() || !firstName.trim() || !lastName.trim() || !email.trim()) {
      modal.setFormError('Please fill in all required fields.')
      return
    }

    try {
      if (modal.editingItem) {
        await updateEmployee({
          id: modal.editingItem.id,
          employee_code: employeeCode.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          designation: designation.trim(),
          department: department.trim(),
          employment_type: employmentType,
          employee_status: employeeStatus,
          manager_id: managerId || null,
          team_id: teamId || null,
          role_name: roleName,
        }).unwrap()
        feedback.notifySuccess(`Employee '${firstName} ${lastName}' updated successfully`)
      }
      modal.close()
    } catch (err) {
      modal.setFormError(extractErrorMessage(err, 'Failed to save employee'))
    }
  }

  const handleToggleStatus = async (emp: Employee) => {
    feedback.clearFeedback()
    const nextStatus = emp.employee_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await updateEmployeeStatus({ id: emp.id, employee_status: nextStatus }).unwrap()
      feedback.notifySuccess(`Employee '${emp.first_name} ${emp.last_name}' status changed to ${nextStatus}`)
    } catch (err) {
      feedback.notifyError(err, 'Failed to change employee status')
    }
  }

  const handleDeactivate = async (id: number) => {
    feedback.clearFeedback()
    try {
      await deleteEmployee(id).unwrap()
      feedback.notifySuccess('Employee deactivated successfully')
      confirm.closeConfirm()
    } catch (err) {
      feedback.notifyError(err, 'Failed to deactivate employee')
      confirm.closeConfirm()
    }
  }

  return {
    isAdmin,
    employees,
    teams,
    isLoading,
    fetchError: fetchError ? extractErrorMessage(fetchError) : null,
    refetch,
    searchTerm,
    setSearchTerm: handleSearchChange,
    selectedDepartment,
    setSelectedDepartment,
    selectedTeamId,
    setSelectedTeamId,
    selectedStatus,
    setSelectedStatus,
    modalOpen: modal.isOpen,
    openEditModal,
    closeModal: modal.close,
    handleSubmit,
    editingEmployee: modal.editingItem,
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
    formError: modal.formError,
    actionError: feedback.actionError,
    actionSuccess: feedback.actionSuccess,
    setActionError: feedback.setActionError,
    setActionSuccess: feedback.setActionSuccess,
    isSubmitting: isUpdating || isUpdatingStatus || isDeleting,
    deactivateConfirmId: confirm.confirmTarget,
    setDeactivateConfirmId: confirm.setConfirmTarget,
    handleDeactivate,
    handleToggleStatus,
  }
}
