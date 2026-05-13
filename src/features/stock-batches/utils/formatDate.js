/**
 * @function formatDate
 * @description Reusable date formatting utility.
 * Converts ISO date strings to readable formats.
 *
 * @param {string|Date} dateInput - ISO date string or Date object
 * @param {'long'|'short'} style - 'long' = "May 12, 2026", 'short' = "12 May 2026"
 * @returns {string} Formatted date string or "—" if invalid
 */
export const formatDate = (dateInput, style = "long") => {
  if (!dateInput) return "—";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  if (style === "short") {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Default: "long" → May 12, 2026
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
