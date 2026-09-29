export interface Employee {
  id: number
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  designation: string
  department: string
  employment_type: string
  employee_status: string
  manager_id: number | null
  team_id: number | null
  manager_name?: string | null
  team_name?: string | null
  is_user_linked: boolean
  role_name?: string | null
  user_id?: number | null
  created_at: string
  updated_at: string
}

export interface EmployeeCreatePayload {
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  designation: string
  department: string
  employment_type: string
  employee_status?: string
  manager_id?: number | null
  team_id?: number | null
  role_name?: string
  sso_user_id?: string | null
}

export interface EmployeeUpdatePayload {
  id: number
  employee_code?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string | null
  designation?: string
  department?: string
  employment_type?: string
  employee_status?: string
  manager_id?: number | null
  team_id?: number | null
  role_name?: string
}

export interface EmployeeFilterParams {
  search?: string
  department?: string
  team_id?: number
  employee_status?: string
}

export interface CSVRowError {
  row: number
  employee?: string
  field: string
  message: string
}

export interface CSVValidationResponse {
  total_rows: number
  valid_count: number
  to_create_count: number
  to_update_count: number
  failed_count: number
  errors: CSVRowError[]
}

export interface CSVImportSummary {
  total_rows: number
  imported_count: number
  updated_count?: number
  failed_count: number
  errors: CSVRowError[]
}
