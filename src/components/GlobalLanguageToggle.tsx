import React from "react";
import { useLocation } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const GlobalLanguageToggle: React.FC = () => {
  const location = useLocation();
  const isInAdminLayout = location.pathname.startsWith("/admin");

  if (isInAdminLayout) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 rounded-full bg-white/90 shadow-lg ring-1 ring-black/5 backdrop-blur-sm">
      <LanguageSwitcher variant="pill" />
    </div>
  );
};

export default GlobalLanguageToggle;

