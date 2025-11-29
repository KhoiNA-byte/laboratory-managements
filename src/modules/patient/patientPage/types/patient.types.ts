/**
 * Patient module type definitions
 */

export interface PatientActionHandlers {
  onView: (mrn: string) => void;
  onEdit: (mrn: string) => void;
  onDelete: (mrn: string) => void;
}

export interface PatientSearchState {
  searchTerm: string;
  query: string;
}

export interface PatientPaginationState {
  currentPage: number;
  totalPages: number;
  startIndex: number;
}

export interface DropdownState {
  openDropdown: string | null;
}
