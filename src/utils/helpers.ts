// Helper functions for test order form

/**
 * Format age input to only allow numbers
 */
export const formatAgeInput = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

/**
 * Format phone number input to only allow numbers and limit to 10 digits
 */
export const formatPhoneInput = (value: string): string => {
  return value.replace(/[^0-9]/g, "").substring(0, 10);
};

/**
 * Convert date picker value (YYYY-MM-DD) to MM/DD/YYYY format
 */
export const convertDatePickerToDisplay = (value: string): string => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
};

/**
 * Format manual date input with MM/DD/YYYY format
 */
export const formatDateInput = (value: string): string => {
  // Allow only numbers
  let formatted = value.replace(/[^\d]/g, "");

  if (formatted.length >= 2) {
    formatted = formatted.substring(0, 2) + "/" + formatted.substring(2);
  }
  if (formatted.length >= 5) {
    formatted = formatted.substring(0, 5) + "/" + formatted.substring(5, 9);
  }

  return formatted;
};

/**
 * Convert MM/DD/YYYY back to YYYY-MM-DD for date input
 */
export const convertDisplayToDatePicker = (dateStr: string): string => {
  if (!dateStr) return "";
  const [month, day, year] = dateStr.split("/");
  if (month && day && year) {
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return "";
};

/**
 * Get today's date in MM/DD/YYYY format
 */
export const getTodayFormatted = (): string => {
  const today = new Date();
  return `${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${today
    .getDate()
    .toString()
    .padStart(2, "0")}/${today.getFullYear()}`;
};
