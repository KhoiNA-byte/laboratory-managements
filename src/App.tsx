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
// Community Module
import { CommunityPage } from "./modules/community/CommunityPage";
import UserProfilePage from "./modules/profile/UserProfilePage";
import ReportsPage1 from "./modules/report/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePageWrapper />} />
        <Route path="/landing" element={<HomePageWrapper />} />
        <Route path="/community" element={<CommunityPage />} />

        {/* User Home Route - Standalone page without AppLayout */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <HomePageLoggedIn />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes - With AppLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Route - For admins */}
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* IAM Routes */}
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="user-info" element={<UserInfoPage />} />

          {/* Warehouse Routes */}
          <Route path="instruments" element={<InstrumentsPage />} />
          <Route path="instruments/new" element={<AddInstrumentPage />} />
          <Route
            path="instruments/:instrumentId/edit"
            element={<EditInstrumentPage />}
          />
          <Route
            path="instruments/:instrumentId"
            element={<InstrumentDetailsPage />}
          />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="reagents" element={<ReagentsPage />} />
          <Route path="flagging-rules" element={<FlaggingRulesPage />} />

          {/* Test Order Routes */}
          <Route path="test-orders" element={<TestOrdersPage />} />
          <Route path="test-orders/new" element={<NewTestOrderPage />} />
          <Route
            path="test-orders/:orderId/edit"
            element={<UpdateTestOrderPage />}
          />
          <Route
            path="test-orders/:orderId"
            element={<TestOrderDetailsPage />}
          />
          <Route path="test-results" element={<TestResultPage />} />
          <Route
            path="test-results/:orderNumber"
            element={<TestResultPage />}
          />
          <Route path="my-test-results" element={<MyTestResultsPage />} />

          {/* Monitoring Routes */}
          <Route path="monitoring" element={<MonitoringPage />} />
          <Route path="hl7-messages" element={<HL7MessagesPage />} />
          <Route path="quarantine" element={<QuarantinePage />} />
          <Route path="instrument-logs" element={<InstrumentLogsPage />} />

          {/* Patient Routes */}
          <Route path="patients/:id/edit" element={<EditPatientPage />} />
          <Route path="patients/:id" element={<PatientDetailsPage />} />
          <Route path="patients" element={<PatientsPage />} />

          {/* Audit Routes */}
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="reports" element={<ReportsPage1 />} />

          {/* Settings Route */}
          <Route
            path="settings"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p>Settings page coming soon...</p>
              </div>
            }
          />

          {/* My Profile Route */}
          <Route path="profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
