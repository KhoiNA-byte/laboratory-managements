import React from "react";
import { useTranslation } from "react-i18next";

interface ErrorMessageProps {
  error: string;
}

/**
 * Error message component
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const { t } = useTranslation("common");

  return (
    <div className="text-center text-red-600 py-4">
      {t("common.error")}: {error}
    </div>
  );
};
