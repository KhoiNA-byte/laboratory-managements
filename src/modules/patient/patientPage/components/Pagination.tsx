import React from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Pagination component
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  const { t } = useTranslation("common");

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-0 mb-4 space-x-2">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        {t("common.previous")}
      </button>
      <span className="text-sm text-gray-600">
        {t("common.page", { current: currentPage, total: totalPages })}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        {t("common.next")}
      </button>
    </div>
  );
};
