import { useGetBuildingsQuery } from '../../store/api/buildingApi'
import { useGetFloorsQuery } from '../../store/api/floorApi'
import { useGetEmployeesQuery } from '../../store/api/employeeApi'
import { useGetUsersQuery } from '../../store/api/userManagementApi'
import { useGetHealthQuery } from '../../store/api/baseApi'

export const useHomePage = () => {
  const { data: health, isLoading: isHealthLoading, error: healthError } = useGetHealthQuery()
  const { data: buildings = [], isLoading: isBuildingsLoading } = useGetBuildingsQuery()
  const { data: floors = [], isLoading: isFloorsLoading } = useGetFloorsQuery()
  const { data: employees = [], isLoading: isEmployeesLoading } = useGetEmployeesQuery()
  const { data: users = [], isLoading: isUsersLoading } = useGetUsersQuery()

  const totalBuildings = buildings.length
  const totalFloors = floors.length
  const totalEmployees = employees.length
  const activeEmployees = employees.filter((e) => e.employee_status === 'ACTIVE').length
  const activeUsers = users.filter((u) => u.is_active).length
  const totalUsers = users.length

  const isLoading =
    isHealthLoading ||
    isBuildingsLoading ||
    isFloorsLoading ||
    isEmployeesLoading ||
    isUsersLoading

  return {
    health,
    healthError,
    totalBuildings,
    totalFloors,
    totalEmployees,
    activeEmployees,
    activeUsers,
    totalUsers,
    isLoading,
  }
}
