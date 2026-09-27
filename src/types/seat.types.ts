export type SeatStatus = "Vacant" | "Occupied" | "Blocked";

export interface Seat {
  id: number;
  floor_id: number;
  seat_number: string;
  seat_type: string;
  status: SeatStatus;
  x_position: number;
  y_position: number;
  employee_id: number | null;
  employee_name: string | null;
  employee_code: string | null;
  employee_email: string | null;
  building_id?: number | null;
  building_name?: string | null;
  floor_name?: string | null;
  floor_number?: number | null;
}

export interface FloorSummaryItem {
  floor_id: number;
  floor_name: string;
  floor_number: number;
  total_seats: number;
  occupied_seats: number;
  vacant_seats: number;
}

export interface BuildingSeatingSummary {
  building_id: number;
  building_name: string;
  total_seats: number;
  occupied_seats: number;
  vacant_seats: number;
  floors: FloorSummaryItem[];
}

export interface RoleDistributionItem {
  role_name: string;
  count: number;
  percent: string;
}

export interface SeatingOverview {
  total_seats: number;
  total_occupied: number;
  total_vacant: number;
  total_blocked: number;
  buildings: BuildingSeatingSummary[];
  role_distribution?: RoleDistributionItem[];
}

export interface FloorSeatingMap {
  floor_id: number;
  floor_name: string;
  floor_number: number;
  building_id: number;
  building_name: string;
  map_width: number;
  map_height: number;
  total_seats: number;
  occupied_seats: number;
  vacant_seats: number;
  blocked_seats: number;
  seats: Seat[];
}

export interface SeatAssignPayload {
  employee_id: number;
  notes?: string;
}

export interface SeatRelocatePayload {
  current_seat_id: number;
  target_seat_id: number;
  notes?: string;
}

export interface SeatSwapPayload {
  seat_id: number;
  target_employee_id: number;
  notes?: string;
}

export interface SeatReleasePayload {
  notes?: string;
}

export interface SeatHistoryItem {
  id: number;
  seat_id: number;
  seat_number: string;
  employee_id: number | null;
  employee_name: string | null;
  employee_code: string | null;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  action_date: string;
}

export interface SeatCreatePayload {
  floor_id: number;
  seat_number: string;
  seat_type?: string;
  status?: SeatStatus;
  x_position?: number;
  y_position?: number;
}

export interface SeatBatchCreatePayload {
  floor_id: number;
  count: number;
  prefix?: string;
  start_number?: number;
  seat_type?: string;
}

export interface SeatUpdatePayload {
  seat_number?: string;
  seat_type?: string;
  status?: SeatStatus;
  x_position?: number;
  y_position?: number;
}
