import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PERMISSIONS } from "./constants/permissions";

// Dashboard Module
import { DashboardPage } from "./modules/dashboard/DashboardPage";

// Home Module
import { HomePageWrapper } from "./modules/home/HomePageWrapper";
import { HomePageLoggedIn } from "./modules/home/HomePageLoggedIn";

// IAM Module
import { LoginPage } from "./modules/iam/LoginPage";
import { VerifyOTPPage } from "./modules/iam/VerifyOTPPage";
import { ResetPasswordPage } from "./modules/iam/ResetPasswordPage";
import { UsersPage } from "./modules/iam/UsersPage";
import { RolesPage } from "./modules/iam/RolesPage";
import UserInfoPage from "./modules/iam/UserInfoPage";
import { UnauthorizedPage } from "./modules/iam/UnauthorizedPage";

// Warehouse Module
import InstrumentsPage from "./modules/warehouse/InstrumentsPage";
import { ReagentsPage } from "./modules/warehouse/ReagentsPage";
import { WarehousePage } from "./modules/warehouse/WarehousePage";
import { FlaggingRulesPage } from "./modules/warehouse/FlaggingRulesPage";
import InstrumentDetailsPage from "./modules/warehouse/InstrumentDetailPopup";
import EditInstrumentPage from "./modules/warehouse/EditInstrumentPage";
import AddInstrumentPage from "./modules/warehouse/AddInstrumentPage";

// Test Order Module
import { TestOrdersPage } from "./modules/testorder/TestOrdersPage";
import { TestResultPage } from "./modules/testorder/TestResultPage";
import MyTestResultsPage from "./modules/testorder/MyTestResultsPage";
import TestOrderDetailsPage from "./modules/testorder/TestOrderDetailsPage";
import UpdateTestOrderPage from "./modules/testorder/UpdateTestOrderPage";
import NewTestOrderPage from "./modules/testorder/NewTestOrderPage";

// Monitoring Module
import { MonitoringPage } from "./modules/monitoring/MonitoringPage";
import { HL7MessagesPage } from "./modules/monitoring/HL7MessagesPage";
import { QuarantinePage } from "./modules/monitoring/QuarantinePage";
import { InstrumentLogsPage } from "./modules/monitoring/InstrumentLogsPage";

// Patient Module
import { PatientsPage } from "./modules/patient/PatientsPage";
import { PatientDetailsPage } from "./modules/patient/PatientDetailsPage";
import { EditPatientPage } from "./modules/patient/EditPatientPage";

// Audit Module
import { AuditLogsPage } from "./modules/audit/AuditLogsPage";
import { ReportsPage } from "./modules/audit/ReportsPage";

// Community Module
import { CommunityPage } from "./modules/community/CommunityPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePageWrapper />} />
        <Route path="/landing" element={<HomePageWrapper />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* User Home Route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute
              allowedPermissions={[PERMISSIONS.HOME_ACCESS]}
              fallbackPath="/unauthorized"
            >
              <HomePageLoggedIn />
            </ProtectedRoute>
          }
        />

        {/* Shared Admin Dashboard Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute fallbackPath="/unauthorized">
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Routes */}
          <Route
            index
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.DASHBOARD_READ]}
                fallbackPath="/unauthorized"
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.DASHBOARD_READ]}
                fallbackPath="/unauthorized"
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* IAM Routes */}
          <Route
            path="users"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.USERS_READ]}
                fallbackPath="/unauthorized"
              >
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.ROLES_READ]}
                fallbackPath="/unauthorized"
              >
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-info"
            element={
              <ProtectedRoute fallbackPath="/unauthorized">
                <UserInfoPage />
              </ProtectedRoute>
            }
          />

          {/* Warehouse Routes */}
          <Route
            path="instruments"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.INSTRUMENTS_READ]}
                fallbackPath="/unauthorized"
              >
                <InstrumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instruments/new"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.INSTRUMENTS_WRITE]}
                fallbackPath="/unauthorized"
              >
                <AddInstrumentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instruments/:instrumentId/edit"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.INSTRUMENTS_WRITE]}
                fallbackPath="/unauthorized"
              >
                <EditInstrumentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instruments/:instrumentId"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.INSTRUMENTS_READ]}
                fallbackPath="/unauthorized"
              >
                <InstrumentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="warehouse"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.WAREHOUSE_READ]}
                fallbackPath="/unauthorized"
              >
                <WarehousePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reagents"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.WAREHOUSE_READ]}
                fallbackPath="/unauthorized"
              >
                <ReagentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="flagging-rules"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.WAREHOUSE_WRITE]}
                fallbackPath="/unauthorized"
              >
                <FlaggingRulesPage />
              </ProtectedRoute>
            }
          />

          {/* Test Order Routes */}
          <Route
            path="test-orders"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.TEST_ORDERS_READ]}
                fallbackPath="/unauthorized"
              >
                <TestOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-orders/new"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.TEST_ORDERS_WRITE]}
                fallbackPath="/unauthorized"
              >
                <NewTestOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-orders/:orderId/edit"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.TEST_ORDERS_WRITE]}
                fallbackPath="/unauthorized"
              >
                <UpdateTestOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-orders/:orderId"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.TEST_ORDERS_READ]}
                fallbackPath="/unauthorized"
              >
                <TestOrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-results"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.TEST_ORDERS_READ]}
                fallbackPath="/unauthorized"
              >
                <TestResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-test-results"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.MY_TEST_RESULTS_READ]}
                fallbackPath="/unauthorized"
              >
                <MyTestResultsPage />
              </ProtectedRoute>
            }
          />

          {/* Monitoring Routes */}
          <Route
            path="monitoring"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.MONITORING_READ]}
                fallbackPath="/unauthorized"
              >
                <MonitoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="hl7-messages"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.MONITORING_READ]}
                fallbackPath="/unauthorized"
              >
                <HL7MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quarantine"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.MONITORING_READ]}
                fallbackPath="/unauthorized"
              >
                <QuarantinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instrument-logs"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.MONITORING_READ]}
                fallbackPath="/unauthorized"
              >
                <InstrumentLogsPage />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="patients"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.PATIENTS_READ]}
                fallbackPath="/unauthorized"
              >
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients/:id"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.PATIENTS_READ]}
                fallbackPath="/unauthorized"
              >
                <PatientDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients/:id/edit"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.PATIENTS_WRITE]}
                fallbackPath="/unauthorized"
              >
                <EditPatientPage />
              </ProtectedRoute>
            }
          />

          {/* Audit Routes */}
          <Route
            path="audit-logs"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.AUDIT_READ]}
                fallbackPath="/unauthorized"
              >
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute
                allowedPermissions={[PERMISSIONS.REPORTS_READ]}
                fallbackPath="/unauthorized"
              >
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Settings Route - Any authenticated user in admin layout */}
          <Route
            path="settings"
            element={
              <ProtectedRoute fallbackPath="/unauthorized">
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <p>Settings page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* My Profile Route - Any authenticated user in admin layout */}
          <Route
            path="profile"
            element={
              <ProtectedRoute fallbackPath="/unauthorized">
                <div className="p-6">
                  <h1 className="text-2xl font-bold">My Profile</h1>
                  <p>Profile page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
