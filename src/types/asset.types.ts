export type AssetType = 'Monitor' | 'Mouse' | 'Earphone' | 'Desktop' | string

export type AssetStatus = 'Available' | 'Assigned' | 'Under Maintenance' | 'Retired'

export type AssetAllocationAction = 'ASSIGN' | 'RETURN' | 'MAINTENANCE' | 'REPLACE'

export interface AssetAllocation {
  id: number
  asset_id: number
  employee_id: number
  allocated_at: string
  returned_at: string | null
  action: AssetAllocationAction
  notes: string | null
  employee_name?: string | null
  employee_code?: string | null
  asset_code?: string | null
  asset_type?: string | null
}

export interface Asset {
  id: number
  asset_code: string
  asset_type: AssetType
  name?: string
  model_name?: string | null
  serial_number: string | null
  status: AssetStatus
  specifications?: Record<string, unknown> | null
  notes?: string | null
  created_at: string
  updated_at: string
  current_employee_id?: number | null
  current_employee_name?: string | null
  current_employee_code?: string | null
  current_allocation?: AssetAllocation | null
}

export interface AssetCreatePayload {
  asset_code: string
  asset_type: AssetType
  name?: string
  model_name?: string | null
  serial_number?: string | null
  specifications?: Record<string, unknown> | null
  notes?: string | null
}

export interface AssetUpdatePayload {
  model_name?: string | null
  serial_number?: string | null
  status?: AssetStatus
  specifications?: Record<string, unknown> | null
  notes?: string | null
}

export interface AssetAllocatePayload {
  employee_id: number
  notes?: string | null
}

export interface AssetReturnPayload {
  notes?: string | null
}

export interface AssetMaintenancePayload {
  notes?: string | null
}

export interface AssetReplacePayload {
  replacement_asset_id: number
  notes?: string | null
}
