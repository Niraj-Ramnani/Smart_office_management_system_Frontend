export interface UserProfile {
  id: number
  email: string
  employee_id: number | null
  role: string
  is_active: boolean
}

export interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
