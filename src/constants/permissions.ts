// constants/permissions.ts
export const PERMISSIONS = {
  // User Management
  USERS_READ: "users.read",
  USERS_WRITE: "users.write",
  USERS_DELETE: "users.delete",

  // Role Management
  ROLES_READ: "roles.read",
  ROLES_WRITE: "roles.write",
  ROLES_DELETE: "roles.delete",

  // Patient Management
  PATIENTS_READ: "patients.read",
  PATIENTS_WRITE: "patients.write",
  PATIENTS_DELETE: "patients.delete",

  // Test Orders
  TEST_ORDERS_READ: "test_orders.read",
  TEST_ORDERS_WRITE: "test_orders.write",
  TEST_ORDERS_DELETE: "test_orders.delete",

  // Instruments
  INSTRUMENTS_READ: "instruments.read",
  INSTRUMENTS_WRITE: "instruments.write",
  INSTRUMENTS_DELETE: "instruments.delete",

  // Warehouse
  WAREHOUSE_READ: "warehouse.read",
  WAREHOUSE_WRITE: "warehouse.write",

  // Monitoring
  MONITORING_READ: "monitoring.read",
  MONITORING_WRITE: "monitoring.write",

  // Audit
  AUDIT_READ: "audit.read",
  REPORTS_READ: "reports.read",

  // Dashboard
  DASHBOARD_READ: "dashboard.read",

  // Home Access
  HOME_ACCESS: "home.access",

  // My Test Results
  MY_TEST_RESULTS_READ: "my_test_results.read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
