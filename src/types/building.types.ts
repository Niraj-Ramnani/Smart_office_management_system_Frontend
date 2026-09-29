export interface Building {
  id: number
  name: string
  code: string
  address: string | null
  created_at: string
  updated_at: string
  floor_count: number
}

export interface BuildingCreatePayload {
  name: string
  code: string
  address?: string | null
}

export interface BuildingUpdatePayload {
  id: number
  name?: string
  code?: string
  address?: string | null
}
