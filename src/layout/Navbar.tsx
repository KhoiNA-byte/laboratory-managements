// src/components/Navbar.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { logoutRequest } from "../store/slices/authSlice";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";

const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  "/admin/my-test-results": {
    title: "Test Results",
    subtitle: "Your laboratory test history and results",
  },
  "/admin/test-orders": {
    title: "Test Orders",
    subtitle: "Manage laboratory test orders",
  },
  "/admin/roles": {
    title: "Roles Management",
    subtitle: "Manage user roles and permissions",
  },
  "/admin/test-orders/new": {
    title: "New Test Order",
    subtitle: "Create a new test order",
  },
  "/admin/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of laboratory operations and statistics",
  },
  "/admin/users": {
    title: "Users Management",
    subtitle: "Manage system users and their access permissions",
  },
   "/admin/patients": {
    title: "Patient Records",
    subtitle: "Manage patient medical records and information",
  },
   "/admin/instruments": {
    title: "Instruments",
    subtitle: "Manage laboratory instruments and equipment",
  },
   "/admin/warehouse": {
    title: "Warehouse",
    subtitle: "Manage reagents and laboratory supplies",
  },
   "/admin/monitoring": {
    title: "System Monitoring",
    subtitle: "Monitor system health, event logs, and performance metrics",
  },
   "/admin/reports": {
    title: "Reports",
    subtitle: "Generate and export laboratory reports",
  },
   "/admin/profile": {
    title: "Profile",
    subtitle: "View and manage information",
  },
   "/admin/settings": {
    title: "Settings",
    subtitle: "Manage settings and configurations",
  }
};

export interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export const Navbar = ({
  title: propTitle,
  subtitle: propSubtitle,
}: NavbarProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const meta = ROUTE_META[location.pathname] || {};

  const title = propTitle ?? meta.title ?? "Default Title";
  const subtitle = propSubtitle ?? meta.subtitle ?? "";

  const handleLogout = () => dispatch(logoutRequest());

  return (
    <div className="bg-white">
      
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
