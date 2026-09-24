import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage/HomePage'
import { LoginPage } from '../pages/LoginPage/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage'
import { BuildingManagement } from '../pages/BuildingManagement/BuildingManagement'
import { FloorManagement } from '../pages/FloorManagement/FloorManagement'
import { TeamManagement } from '../pages/TeamManagement/TeamManagement'
import { EmployeeManagement } from '../pages/EmployeeManagement/EmployeeManagement'
import { UserManagement } from '../pages/UserManagement/UserManagement'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Protected application routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />

          {/* Organization routes (Admin & Manager) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route path="buildings" element={<BuildingManagement />} />
            <Route path="floors" element={<FloorManagement />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
          </Route>

          {/* Administration routes (Admin only) */}
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
