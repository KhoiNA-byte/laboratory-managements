// Test Order Types and Interfaces

/**
 * Core TestOrder interface from API
 */
export interface TestOrder {
  run_id: string;
  id: string;
  userId: string;
  testType: string;
  status: "Pending" | "In Progress" | "Completed" | "Reviewed";
  priority: "Routine" | "Urgent" | "Stat";
  createdAt: string;
  createdByUserId: number;
  isDeleted: boolean;
  updatedAt: string;
  note: string;
  orderedAt: string;
}

/**
 * Test Order with populated user data for list view
 */
export interface TestOrderWithUser {
  run_id: string;
  orderNumber: string;
  patient: string;
  doctor: string;
  testType: string;
  priority: "Routine" | "Urgent" | "Stat";
  status: "Pending" | "In Progress" | "Completed" | "Reviewed";
  ordered: string;
}

/**
 * Detailed Test Order with all patient and doctor information
 */
export interface TestOrderDetail {
  run_id: string;
  id: string;
  testType: string;
  status: string;
  priority: string;
  note: string;
  ordered: string;
  createdAt: string;
  updatedAt: string;
  // Patient info
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAddress: string;
  patientAge: string;
  patientGender: string;
  patientDateOfBirth: string;
  // Doctor/Tester info
  doctorName: string;
  testerName: string;
  runDay: string;
  testResult: string;
}

/**
 * Form data for creating new test order
 */
export interface TestOrderFormData {
  patientName: string;
  age: string;
  gender: string;
  phoneNumber: string;
  status: string;
  createDate: string;
  note: string;
  runDate: string;
  testType: string;
}

/**
 * API Response Types
 */
export interface TestOrdersResponse {
  data: TestOrder[];
  success: boolean;
  message?: string;
}

export interface TestOrderListResponse {
  data: TestOrderWithUser[];
  success: boolean;
  message?: string;
}

export interface TestOrderDetailResponse {
  data: TestOrderDetail | null;
  success: boolean;
  message?: string;
}

export interface CreateTestOrderResponse {
  data: TestOrder | null;
  success: boolean;
  message?: string;
}

/**
 * Test Order Status and Priority Enums
 */
export type TestOrderStatus = "Pending" | "In Progress" | "Completed" | "Reviewed";
export type TestOrderPriority = "Routine" | "Urgent" | "Stat";

/**
 * Filter and Search types
 */
export interface TestOrderFilters {
  status?: TestOrderStatus;
  priority?: TestOrderPriority;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}