export interface Floor {
  id: number
  building_id: number
  name: string
  floor_number: number
  map_width: number
  map_height: number
  created_at: string
  updated_at: string
  building_name?: string | null
  seat_count: number
}

export interface FloorCreatePayload {
  building_id: number
  name: string
  floor_number: number
  map_width?: number
  map_height?: number
}

export interface FloorUpdatePayload {
  id: number
  building_id?: number
  name?: string
  floor_number?: number
  map_width?: number
  map_height?: number
}
