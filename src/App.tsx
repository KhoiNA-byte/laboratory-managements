import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { ProtectedRoute } from "./auth/ProtectedRoute";

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

// Warehouse Module
import InstrumentsPage from "./modules/warehouse/InstrumentsPage";
import { ReagentsPage } from "./modules/warehouse/ReagentsPage";
import { WarehousePage } from "./modules/warehouse/WarehousePage";
import { FlaggingRulesPage } from "./modules/warehouse/FlaggingRulesPage";
import InstrumentDetailsPage from "./modules/warehouse/InstrumentDetailsPage";
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

        {/* User Home Route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <HomePageLoggedIn />
            </ProtectedRoute>
          }
        />

        {/* Shared Admin Dashboard Layout (all roles can enter) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              allowedRoles={["admin", "manager", "lab_user", "service", "user"]}
            >
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Routes (restricted to higher roles) */}
          <Route
            index
            element={
              <ProtectedRoute
                allowedRoles={["admin", "manager", "lab_user", "service"]}
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "manager", "lab_user", "service"]}
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* IAM Routes */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="roles"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-info"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "manager", "lab_user", "service"]}
              >
                <UserInfoPage />
              </ProtectedRoute>
            }
          />

          {/* Warehouse Routes */}
          <Route
            path="instruments"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user", "service"]}>
                <InstrumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instruments/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <AddInstrumentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instruments/:instrumentId/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <EditInstrumentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instruments/:instrumentId"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user", "service"]}>
                <InstrumentDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="warehouse"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <WarehousePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reagents"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <ReagentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="flagging-rules"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <FlaggingRulesPage />
              </ProtectedRoute>
            }
          />

          {/* Test Order Routes */}
          <Route
            path="test-orders"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "lab_user"]}>
                <TestOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-orders/new"
            element={
              <ProtectedRoute allowedRoles={["lab_user"]}>
                <NewTestOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-orders/:orderId/edit"
            element={
              <ProtectedRoute allowedRoles={["lab_user"]}>
                <UpdateTestOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-orders/:orderId"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "lab_user"]}>
                <TestOrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="test-results"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "manager", "lab_user", "service"]}
              >
                <TestResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-test-results"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <MyTestResultsPage />
              </ProtectedRoute>
            }
          />

          {/* Monitoring Routes */}
          <Route
            path="monitoring"
            element={
              <ProtectedRoute allowedRoles={["admin", "service"]}>
                <MonitoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="hl7-messages"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <HL7MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quarantine"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <QuarantinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="instrument-logs"
            element={
              <ProtectedRoute allowedRoles={["admin", "service"]}>
                <InstrumentLogsPage />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path="patients"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "lab_user"]}>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager", "lab_user"]}>
                <PatientDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="patients/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin", "lab_user"]}>
                <EditPatientPage />
              </ProtectedRoute>
            }
          />

          {/* Audit Routes */}
          <Route
            path="audit-logs"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Settings Route */}
          <Route
            path="settings"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "manager", "lab_user", "service"]}
              >
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <p>Settings page coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* My Profile Route — all roles can access */}
          <Route
            path="profile"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "manager",
                  "lab_user",
                  "service",
                  "user",
                ]}
              >
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
