import { useState, useEffect, useRef } from "react";
import { CLICK_OUTSIDE_DELAY } from "../constants/patient.constants";

/**
 * Custom hook for managing dropdown open/close state
 */
export const useDropdown = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    // Add a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, CLICK_OUTSIDE_DELAY);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // Toggle dropdown for a specific patient
  const toggleDropdown = (patientId: string) => {
    setOpenDropdown((prev) => (prev === patientId ? null : patientId));
  };

  // Close dropdown
  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return {
    openDropdown,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  };
};
