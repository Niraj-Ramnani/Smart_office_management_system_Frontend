export type SeatRequestType = "NEW_SEAT" | "RELOCATION" | "SWAP";

export type SeatRequestStatus =
  | "PENDING"
  | "MANAGER_APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface SeatRequest {
  id: number;
  employee_id: number;
  employee_name: string | null;
  employee_code: string | null;
  employee_email: string | null;
  department: string | null;
  request_type: SeatRequestType;
  status: SeatRequestStatus;
  requested_for: string | null;
  details: {
    preferred_seat_id?: number | null;
    target_seat_id?: number | null;
    target_employee_id?: number | null;
    current_seat_id?: number | null;
    current_seat_number?: string | null;
    target_seat_number?: string | null;
    reason?: string | null;
    [key: string]: unknown;
  } | null;
  approved_by: number | null;
  approver_name: string | null;
  approved_at: string | null;
  assigned_to: number | null;
  executor_name: string | null;
  completed_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeatRequestCreatePayload {
  request_type: SeatRequestType;
  preferred_seat_id?: number | null;
  target_seat_id?: number | null;
  target_employee_id?: number | null;
  reason?: string | null;
}

export interface SeatRequestReviewPayload {
  action: "APPROVE" | "REJECT";
  rejected_reason?: string | null;
}

export interface SeatRequestExecutePayload {
  seat_id?: number | null;
  notes?: string | null;
}
