import { Routes, Route } from 'react-router-dom'
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
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<SeatingManagement />} />
          <Route path="seats" element={<SeatingManagement />} />
          <Route path="seat-requests" element={<SeatRequestsPage />} />

          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route path="buildings" element={<BuildingManagement />} />
            <Route path="floors" element={<FloorManagement />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
