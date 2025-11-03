import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logoutRequest } from "../store/slices/authSlice";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleUserDropdownToggle = () => setShowUserDropdown((s) => !s);
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
      label: "Dashboard",
      icon: "grid",
      roles: ["admin"],
    },
    {
      path: "/admin/users",
      label: "Users Management",
      icon: "users",
      roles: ["admin"],
    },
    {
      path: "/admin/roles",
      label: "Roles Management",
      icon: "user",
      roles: ["admin"],
    },
    {
      path: "/admin/patients",
      label: "Patient Records",
      icon: "document",
      roles: ["user", "admin"],
    },
    {
      path: "/admin/test-orders",
      label: "Test Orders",
      icon: "pencil",
      roles: ["user", "admin"],
    },
    {
      path: "/admin/my-test-results",
      label: "My Test Results",
      icon: "document",
      roles: ["user", "admin"],
    },
    {
      path: "/admin/instruments",
      label: "Instruments",
      icon: "flask",
      roles: ["admin"],
    },
    {
      path: "/admin/warehouse",
      label: "Warehouse",
      icon: "box",
      roles: ["admin"],
    },
    {
      path: "/admin/monitoring",
      label: "Monitoring",
      icon: "chart",
      roles: ["admin"],
    },
    {
      path: "/admin/reports",
      label: "Reports",
      icon: "bar-chart",
      roles: ["admin"],
    },
    {
      path: "/admin/profile",
      label: "My Profile",
      icon: "user",
      roles: ["user", "admin"],
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: "cog",
      roles: ["user", "admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role ?? "user")
  );

  const getIcon = (iconName: string): JSX.Element | null => {
    const commonProps = {
      className: "h-5 w-5",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
    };
    const icons: Record<string, JSX.Element> = {
      grid: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      users: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      user: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      document: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      pencil: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      ),
      flask: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      box: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      chart: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      "bar-chart": (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      cog: (
        <svg {...commonProps}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    };

    return icons[iconName] ?? null;
  };

  return (
    // fixed full width sidebar (no collapse)
    <aside className="w-64 bg-white h-screen transition-all duration-300 relative">
      <div className="px-3 py-3 flex flex-col justify-between h-full overflow-y-auto">
        {/* Header: logo + title */}
        <div className="flex items-center mb-6 gap-2">
          <div className="w-10 h-10 rounded flex items-center justify-center mr-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block"
            >
              <rect width="40" height="40" rx="12" fill="#2563EB" />
              <path
                d="M18.3329 11.667V17.9395C18.3331 18.1987 18.2729 18.4543 18.1571 18.6862L13.9329 27.1253C13.8687 27.2528 13.8382 27.3947 13.8446 27.5373C13.8509 27.6799 13.8938 27.8185 13.9691 27.9398C14.0443 28.0611 14.1495 28.161 14.2745 28.23C14.3995 28.299 14.5401 28.3347 14.6829 28.3337H25.3162C25.459 28.3347 25.5996 28.299 25.7246 28.23C25.8496 28.161 25.9548 28.0611 26.0301 27.9398C26.1054 27.8185 26.1482 27.6799 26.1546 27.5373C26.1609 27.3947 26.1305 27.2528 26.0662 27.1253L21.8421 18.6862C21.7262 18.4543 21.666 18.1987 21.6662 17.9395V11.667"
                stroke="white"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.083 11.667H22.9163"
                stroke="white"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.833 23.333H24.1663"
                stroke="white"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="font-semibold text-lg">Laboratory Management</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const baseClass = `flex items-center px-4 py-3 rounded-lg transition-colors`;
            const activeClass = isActive
              ? "bg-blue-100 text-blue-800 border-l-4 border-blue-600"
              : "text-black hover:bg-gray-100";
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${baseClass} ${activeClass}`}
              >
                <span className="mr-3">{getIcon(item.icon)}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile at bottom */}
        <div>
          <div className="relative">
            <button
              onClick={handleUserDropdownToggle}
              className="w-full flex items-center p-3 bg-blue-600 text-white rounded-t-lg hover:bg-blue-700 transition-colors"
            >
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AU"}
              </div>

              <div className="flex-1 text-left text-black">
                <div className="font-medium">{user?.name ?? "Admin User"}</div>
                <div className="text-sm text-blue-100">
                  {user?.role ?? "Administrator"}
                </div>
              </div>

              <svg
                className={`h-4 w-4 transition-transform ${
                  showUserDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                {[
                  {
                    label: "Profile",
                    onClick: handleProfile,
                    iconPath:
                      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  },
                  {
                    label: "History",
                    onClick: handleHistory,
                    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    label: "Dashboard",
                    onClick: handleDashboard,
                    iconPath: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2...",
                  },
                  {
                    label: "Logout",
                    onClick: handleLogout,
                    iconPath: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1...",
                    className: "text-red-600",
                  },
                ].map(
                  ({
                    label,
                    onClick,
                    iconPath,
                    className = "text-gray-700",
                  }) => (
                    <button
                      key={label}
                      onClick={onClick}
                      className={`w-full flex items-center px-4 py-3 ${className} hover:bg-gray-50 transition-colors`}
                    >
                      <svg
                        className="h-5 w-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={iconPath}
                        />
                      </svg>
                      <span>{label}</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
