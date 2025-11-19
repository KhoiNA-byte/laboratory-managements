// src/components/Navbar.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { matchPath, useLocation } from "react-router-dom";
import { logoutRequest } from "../store/slices/authSlice";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

const ROUTE_TRANSLATION_PATTERNS: { key: string; path: string; end?: boolean }[] =
  [
    { key: "dashboard", path: "/admin", end: true },
    { key: "dashboard", path: "/admin/dashboard" },
    { key: "users", path: "/admin/users" },
    { key: "userInfo", path: "/admin/user-info" },
    { key: "roles", path: "/admin/roles" },
    { key: "patients", path: "/admin/patients", end: true },
    { key: "patientDetails", path: "/admin/patients/:id", end: true },
    { key: "editPatient", path: "/admin/patients/:id/edit" },
    { key: "testOrders", path: "/admin/test-orders", end: true },
    { key: "newTestOrder", path: "/admin/test-orders/new" },
    { key: "editTestOrder", path: "/admin/test-orders/:orderId/edit" },
    { key: "testOrderDetails", path: "/admin/test-orders/:orderId", end: true },
    { key: "myTestResults", path: "/admin/my-test-results" },
    { key: "instruments", path: "/admin/instruments", end: true },
    { key: "addInstrument", path: "/admin/instruments/new" },
    { key: "editInstrument", path: "/admin/instruments/:instrumentId/edit" },
    { key: "instrumentDetails", path: "/admin/instruments/:instrumentId", end: true },
    { key: "warehouse", path: "/admin/warehouse" },
    { key: "flaggingRules", path: "/admin/flagging-rules" },
    { key: "monitoring", path: "/admin/monitoring" },
    { key: "hl7Messages", path: "/admin/hl7-messages" },
    { key: "quarantine", path: "/admin/quarantine" },
    { key: "instrumentLogs", path: "/admin/instrument-logs" },
    { key: "reports", path: "/admin/reports" },
    { key: "auditLogs", path: "/admin/audit-logs" },
    { key: "profile", path: "/admin/profile" },
    { key: "settings", path: "/admin/settings" },
  ];

const resolveRouteKey = (pathname: string) => {
  for (const pattern of ROUTE_TRANSLATION_PATTERNS) {
    if (
      matchPath(
        { path: pattern.path, end: pattern.end ?? true },
        pathname
      )
    ) {
      return pattern.key;
    }
  }
  return undefined;
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
  const { t } = useTranslation(["navbar", "common"]);

  const routeKey = resolveRouteKey(location.pathname);

  const title =
    propTitle ??
    (routeKey
      ? t(`navbar:routes.${routeKey}.title`)
      : t("navbar:defaultTitle"));
  const subtitle =
    propSubtitle ??
    (routeKey
      ? t(`navbar:routes.${routeKey}.subtitle`)
      : t("navbar:defaultSubtitle"));

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
            <div className="relative hidden lg:block">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t("navbar:searchPlaceholder")}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <LanguageSwitcher className="hidden md:inline-flex" />
            <div className="relative" aria-label={t("navbar:notificationsLabel")}>
              <BellIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("common:logout")}
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:hidden">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("navbar:searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <LanguageSwitcher className="self-start" />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
