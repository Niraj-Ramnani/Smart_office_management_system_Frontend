import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { MainLayout } from '../layouts/MainLayout'
import { LoginPage } from '../pages/LoginPage/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage'
import { BuildingManagement } from '../pages/BuildingManagement/BuildingManagement'
import { FloorManagement } from '../pages/FloorManagement/FloorManagement'
import { TeamManagement } from '../pages/TeamManagement/TeamManagement'
import { EmployeeManagement } from '../pages/EmployeeManagement/EmployeeManagement'
import { UserManagement } from '../pages/UserManagement/UserManagement'
import { SeatingManagement } from '../pages/SeatingManagement/SeatingManagement'
import { SeatRequestsPage } from '../pages/SeatRequests/SeatRequestsPage'
import { EmployeeDashboard } from '../pages/EmployeeDashboard/EmployeeDashboard'
import { AssetManagement } from '../pages/AssetManagement/AssetManagement'
import { ProtectedRoute } from './ProtectedRoute'

const WorkspaceIndex: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  if (user?.role === 'Employee') {
    return <EmployeeDashboard />
  }
  return <SeatingManagement />
}

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<WorkspaceIndex />} />
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="seats" element={<SeatingManagement />} />
          <Route path="seat-requests" element={<SeatRequestsPage />} />

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route path="buildings" element={<BuildingManagement />} />
            <Route path="floors" element={<FloorManagement />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="assets" element={<AssetManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
