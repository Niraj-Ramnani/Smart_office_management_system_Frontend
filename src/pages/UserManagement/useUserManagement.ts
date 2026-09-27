import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { RootState } from '../../store/store'
import {
  useGetRolesQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from '../../store/api/userManagementApi'
import {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
} from '../../store/api/employeeApi'
import { useGetTeamsQuery } from '../../store/api/teamApi'
import { extractErrorMessage } from '../../utils/authErrors'
import { useActionFeedback } from '../../hooks'

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
  const { data: employees = [], refetch: refetchEmployees } = useGetEmployeesQuery()
  const { data: teams = [] } = useGetTeamsQuery()

  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation()
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation()
  const [createEmployee, { isLoading: isOnboarding }] = useCreateEmployeeMutation()

  const feedback = useActionFeedback()

  const [onboardModalOpen, setOnboardModalOpen] = useState(false)
  const [csvModalOpen, setCsvModalOpen] = useState(false)
  const [onboardError, setOnboardError] = useState<string | null>(null)

  const [employeeCode, setEmployeeCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [designation, setDesignation] = useState('')
  const [department, setDepartment] = useState('')
  const [employmentType, setEmploymentType] = useState('FULL_TIME')
  const [employeeStatus, setEmployeeStatus] = useState('ACTIVE')
  const [managerId, setManagerId] = useState<number | undefined>(undefined)
  const [teamId, setTeamId] = useState<number | undefined>(undefined)
  const [roleName, setRoleName] = useState('Employee')

  const resetOnboardForm = () => {
    setEmployeeCode('')
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setDesignation('')
    setDepartment('')
    setEmploymentType('FULL_TIME')
    setEmployeeStatus('ACTIVE')
    setManagerId(undefined)
    setTeamId(undefined)
    setRoleName('Employee')
    setOnboardError(null)
  }

  const openOnboardModal = () => {
    resetOnboardForm()
    setOnboardModalOpen(true)
  }

  const closeOnboardModal = () => {
    resetOnboardForm()
    setOnboardModalOpen(false)
  }

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOnboardError(null)
    feedback.clearFeedback()

    try {
      await createEmployee({
        employee_code: employeeCode.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        designation: designation.trim(),
        department: department.trim(),
        employment_type: employmentType,
        employee_status: employeeStatus,
        manager_id: managerId,
        team_id: teamId,
        role_name: roleName,
      }).unwrap()

      feedback.notifySuccess(`User & Employee '${firstName} ${lastName}' successfully onboarded with role '${roleName}'`)
      closeOnboardModal()
      refetch()
      refetchEmployees()
    } catch (err) {
      setOnboardError(extractErrorMessage(err, 'Failed to onboard employee and user'))
    }
  }

  const handleCsvSuccess = (count: number) => {
    feedback.notifySuccess(`Successfully imported ${count} employees/users from CSV`)
    refetch()
    refetchEmployees()
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
    isSubmitting: isUpdatingRole || isUpdatingStatus,
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
  }
}
