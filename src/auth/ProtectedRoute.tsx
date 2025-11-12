// auth/ProtectedRouteWithPermissions.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ProtectedRoute {
  children: React.ReactNode;
  allowedRoles?: string[]; // Keep for backward compatibility, but don't use
  allowedPermissions?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRoute> = ({
  children,
  allowedRoles = [], // Ignore this parameter
  allowedPermissions = [],
  fallbackPath = "/unauthorized",
}) => {
  const { isAuthenticated, permissions } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  // Not logged in → go to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ONLY check permissions - ignore roles completely
  const hasAccess =
    allowedPermissions.length === 0 ||
    allowedPermissions.some((permission) => permissions.includes(permission));

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
