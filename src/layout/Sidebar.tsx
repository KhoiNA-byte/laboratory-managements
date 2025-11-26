import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logoutRequest } from "../store/slices/authSlice";
import { PERMISSIONS } from "../constants/permissions";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const permissions = useSelector((state: RootState) => state.auth.permissions);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { t } = useTranslation(["sidebar", "common", "layout"]);

  const handleUserDropdownToggle = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleProfile = () => {
    setShowUserDropdown(false);
    navigate("/admin/user-info");
  };

  const handleHistory = () => {
    setShowUserDropdown(false);
    navigate("/admin/audit-logs");
  };

  const handleDashboard = () => {
    setShowUserDropdown(false);
    navigate("/admin/dashboard");
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
    dispatch(logoutRequest());
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: t('sidebar:dashboard'),
      icon: "grid",
      requiredPermissions: [PERMISSIONS.DASHBOARD_READ],
    },
    {
      path: "/admin/users",
      label: t('sidebar:users_management'),
      icon: "users",
      requiredPermissions: [PERMISSIONS.USERS_READ],
    },
    {
      path: "/admin/roles",
      label: t('sidebar:roles_management'),
      icon: "user",
      requiredPermissions: [PERMISSIONS.ROLES_READ],
    },
    {
      path: "/admin/patients",
      label: t('sidebar:patient_records'),
      icon: "document",
      requiredPermissions: [PERMISSIONS.PATIENTS_READ],
    },
    {
      path: "/admin/test-orders",
      label: t('sidebar:test_orders'),
      icon: "pencil",
      requiredPermissions: [PERMISSIONS.TEST_ORDERS_READ],
    },
    {
      path: "/admin/my-test-results",
      label: t('sidebar:my_test_results'),
      icon: "document",
      requiredPermissions: [PERMISSIONS.MY_TEST_RESULTS_READ],
    },
    {
      path: "/admin/instruments",
      label: t('sidebar:instruments'),
      icon: "flask",
      requiredPermissions: [PERMISSIONS.INSTRUMENTS_READ],
    },
    {
      path: "/admin/warehouse",
      label: t('sidebar:warehouse'),
      icon: "box",
      requiredPermissions: [PERMISSIONS.WAREHOUSE_READ],
    },
    {
      path: "/admin/monitoring",
      label: t('sidebar:monitoring'),
      icon: "chart",
      requiredPermissions: [PERMISSIONS.MONITORING_READ],
    },
    {
      path: "/admin/reports",
      label: t('sidebar:reports'),
      icon: "bar-chart",
      requiredPermissions: [PERMISSIONS.REPORTS_READ],
    },
    {
      path: "/admin/profile",
      label: t('sidebar:my_profile'),
      icon: "user",
      requiredPermissions: [],
    },
  ];

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.requiredPermissions.length === 0) {
      return true;
    }

    return item.requiredPermissions.some(permission =>
      permissions.includes(permission)
    );
  });

  const getIcon = (iconName: string) => {
    const icons = {
      home: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      grid: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      users: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      user: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      document: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      pencil: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      flask: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      box: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      chart: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      "bar-chart": (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      cog: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[iconName as keyof typeof icons] || null;
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-full relative">
      {/* Phần nội dung scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {/* Logo */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mr-3">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span className="font-semibold text-lg text-white">
            {t("layout:appName")}
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
                : "text-white hover:bg-gray-700"
                }`}
            >
              <span className="mr-3">{getIcon(item.icon)}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile - FIXED ở bottom thực sự */}
      <div className="flex-shrink-0 w-full mt-auto">
        <div className="relative w-full">
          <button
            onClick={handleUserDropdownToggle}
            className="w-full flex items-center p-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-none"
          >
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">
                {user?.name || user?.email || t("layout:user.unknown")}
              </div>
              <div className="text-sm text-blue-100 capitalize">
                {user?.role?.replace("_", " ") || t("layout:user.noRole")}
              </div>
            </div>
            <svg
              className={`h-4 w-4 transition-transform ${showUserDropdown ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu với Language Switcher */}
          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 w-full bg-white rounded-t-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Language Switcher */}
              <LanguageSwitcher
                variant="menu"
                onLanguageChange={() => setShowUserDropdown(false)}
              />

              <button
                onClick={handleProfile}
                className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('common:profile')}
              </button>
              {permissions.includes(PERMISSIONS.AUDIT_READ) && (
                <button
                  onClick={handleHistory}
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('common:history')}
                </button>
              )}
              {permissions.includes(PERMISSIONS.DASHBOARD_READ) && (
                <button
                  onClick={handleDashboard}
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  {t('common:dashboard')}
                </button>
              )}
              <div className="border-t border-gray-200"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('common:logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};