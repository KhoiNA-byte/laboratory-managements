import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { DROPDOWN_CLOSE_DELAY } from "../../constants/patient.constants";

interface PatientActionDropdownProps {
  patientId: string;
  isOpen: boolean;
  onToggle: (patientId: string) => void;
  onView: (mrn: string) => void;
  onEdit: (mrn: string) => void;
  onDelete: (mrn: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const PatientActionDropdown: React.FC<PatientActionDropdownProps> = ({
  patientId,
  isOpen,
  onToggle,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation("common");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Giữ vị trí portal dropdown
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Kiểm tra nếu click không phải vào button hoặc dropdown menu
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(target)
      ) {
        onToggle(patientId); // Đóng dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle, patientId]);

  /** Toggle menu + tính toán vị trí dropdown */
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const btn = buttonRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const dropdownHeight = 150; // chiều cao ước tính của dropdown ~150px
      const viewportHeight = window.innerHeight;

      let top = rect.bottom + 6; // mặc định: xuất hiện dưới
      let left = rect.right - 192;

      // Nếu dropdown bị vượt viewport → flip lên trên
      if (rect.bottom + dropdownHeight > viewportHeight) {
        top = rect.top - dropdownHeight - 6; // hiển thị lên trên
      }

      setPosition({ top, left });
    }

    onToggle(patientId);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setTimeout(() => {
      onView(patientId);
    }, DROPDOWN_CLOSE_DELAY);
  };

  const handleEditRecord = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setTimeout(() => {
      onEdit(patientId);
    }, DROPDOWN_CLOSE_DELAY);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(patientId);
  };

  /** Dropdown menu (portal) */
  const dropdownMenu = isOpen ? (
    <div
      ref={dropdownMenuRef}
      className="fixed w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      role="menu"
    >
      <div className="py-1">
        {/* View Details */}
        <button
          onMouseDown={handleViewDetails}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <svg
            className="h-4 w-4 mr-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {t("patientsPage.table.viewDetails")}
        </button>

        {/* Edit Record */}
        <button
          onMouseDown={handleEditRecord}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          <svg
            className="h-4 w-4 mr-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          {t("patientsPage.table.editRecord")}
        </button>

        {/* Delete */}
        <button
          onMouseDown={handleDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          role="menuitem"
        >
          <svg
            className="h-4 w-4 mr-3 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {t("patientsPage.table.deletePatient")}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onMouseDown={handleToggle}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Actions menu"
        aria-expanded={isOpen}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {/* Render dropdown bằng portal */}
      {ReactDOM.createPortal(dropdownMenu, document.body)}
    </>
  );
};
