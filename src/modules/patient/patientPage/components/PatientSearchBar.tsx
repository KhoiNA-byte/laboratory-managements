import React from "react";
import { useTranslation } from "react-i18next";

interface PatientSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  noResults: boolean;
  onAddPatient: () => void;
}

/**
 * Patient search bar component with add patient button
 */
export const PatientSearchBar: React.FC<PatientSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onKeyDown,
  onClear,
  noResults,
  onAddPatient,
}) => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1">
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder={t("patientsPage.filters.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={onKeyDown}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              aria-label={t("patientsPage.filters.searchPlaceholder")}
            />

            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Clear (X) Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={onClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            aria-label="Search"
          >
            {t("common.search")}
          </button>

          {/* No results message */}
          {noResults && (
            <span className="ml-3 text-sm text-red-500 font-medium whitespace-nowrap">
              {t("common.noResults")}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Add Patient Button */}
        <button
          onClick={onAddPatient}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          aria-label={t("patientsPage.filters.addPatient")}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t("patientsPage.filters.addPatient")}
        </button>
      </div>
    </div>
  );
};
