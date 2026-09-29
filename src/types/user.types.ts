export interface Role {
  id: number
  name: string
}

export interface UserManagement {
  id: number
  email: string
  sso_user_id: string | null
  role_id: number
  role_name: string
  employee_id: number | null
  employee_name: string | null
  employee_code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProvisionPayload {
  employee_id: number
  sso_user_id: string
  role_name: string
  email?: string
}

export interface CSVUserRowError {
  row: number
  field: string
  message: string
}

export interface UserProvisionCSVResponse {
  total_rows: number
  imported_count: number
  failed_count: number
  errors: CSVUserRowError[]
}
