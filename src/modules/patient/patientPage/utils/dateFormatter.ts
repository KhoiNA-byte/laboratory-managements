/**
 * Date formatting utility functions
 */

/**
 * Format ISO date string to YYYY-MM-DD format
 * @param isoString - ISO date string
 * @returns Formatted date string or fallback
 */
export const formatDate = (isoString: string): string => {
  if (!isoString) return "—";

  const date = new Date(isoString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    // Fallback: try to extract date portion from string
    return isoString.slice(0, 10);
  }

  return date.toISOString().split("T")[0];
};
