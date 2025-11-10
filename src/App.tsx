// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import  WarehousePage from "./modules/warehouse/WarehousePage";
import { FlaggingRulesPage } from "./modules/warehouse/FlaggingRulesPage";
import InstrumentDetailsPage from "./modules/warehouse/InstrumentDetailsPage";
import EditInstrumentPage from "./modules/warehouse/EditInstrumentPage";
import AddInstrumentPage from "./modules/warehouse/AddInstrumentPage";

// Test Order Module
import { TestOrdersPage } from "./modules/testorder/TestOrdersPage";
import TestResultDetailPage from "./modules/testresult/TestResultDetailPage";
import MyTestResultsPage from "./modules/testresult/MyTestResultsPage";
import TestOrderDetailsPage from "./modules/testorder/TestOrderDetailsPage";
import UpdateTestOrderPage from "./modules/testorder/UpdateTestOrderPage";
import NewTestOrderPage from "./modules/testorder/NewTestOrderPage";
import CommentsPage from "./modules/testresult/CommentsPage";

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

function AppRoutesInner() {
  const location = useLocation();
  // If a navigate call set state.background (navigate(path, { state: { background: location } })),
  // background will hold the previous location and we can render modal on top.
  const state = location.state as { background?: Location } | undefined;
  const background = state && state.background;

  return (
    <>
      {/* Render main routes using background (so background UI stays rendered when modal is open) */}
      <Routes location={background || location}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<HomePageWrapper />} />
        <Route path="/landing" element={<HomePageWrapper />} />
        <Route path="/community" element={<CommunityPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <HomePageLoggedIn />
            </ProtectedRoute>
          }
        />

        {/* Admin area with layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* IAM */}
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="user-info" element={<UserInfoPage />} />

          {/* Warehouse */}
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
          <Route path="flagging-rules" element={<FlaggingRulesPage />} />

          {/* Test Orders */}
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

          {/* Test Results routes (detail route under /admin) */}
          <Route path="test-results" element={<MyTestResultsPage />} />
          <Route
            path="test-results/:orderNumber"
            element={<TestResultDetailPage />}
          />

          <Route path="my-test-results" element={<MyTestResultsPage />} />
          {/* Comments */}

          {/* Monitoring */}
          <Route path="monitoring" element={<MonitoringPage />} />
          <Route path="hl7-messages" element={<HL7MessagesPage />} />
          <Route path="quarantine" element={<QuarantinePage />} />
          <Route path="instrument-logs" element={<InstrumentLogsPage />} />

          {/* Patients */}
          <Route path="patients/:id/edit" element={<EditPatientPage />} />
          <Route path="patients/:id" element={<PatientDetailsPage />} />
          <Route path="patients" element={<PatientsPage />} />

          {/* Audit */}
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="reports" element={<ReportsPage />} />

          {/* misc */}
          <Route
            path="settings"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>
            }
          />
          <Route
            path="profile"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">My Profile</h1>
              </div>
            }
          />
        </Route>
      </Routes>

      {/* If background exists, render the modal route on top (matching same path) */}
      {background && (
        <Routes>
          {/* Note: this path must match the nested admin modal path exactly */}
          <Route
            path="/admin/test-results/:orderNumber"
            element={<TestResultDetailPage />}
          />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutesInner />
    </Router>
  );
}
