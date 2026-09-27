export interface TeamMember {
  id: number
  employee_code: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  designation: string
  department: string
  employee_status: string
  seat_number?: string | null
}

export interface Team {
  id: number
  name: string
  department: string
  manager_id: number
  manager_name?: string | null
  manager_email?: string | null
  manager_designation?: string | null
  manager_employee_code?: string | null
  manager_seat_number?: string | null
  member_count: number
  members?: TeamMember[]
  created_at: string
  updated_at: string
}

export interface TeamCreatePayload {
  name: string
  department: string
  manager_id: number
}

export interface TeamUpdatePayload {
  id: number
  name?: string
  department?: string
  manager_id?: number
}
