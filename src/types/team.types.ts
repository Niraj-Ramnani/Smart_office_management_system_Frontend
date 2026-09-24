export interface Team {
  id: number
  name: string
  department: string
  manager_id: number
  manager_name?: string | null
  manager_email?: string | null
  member_count: number
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
