/**
 * Date math utilities for life-in-weeks grid
 * All dates are treated as date-only using UTC to avoid timezone bugs
 */

/**
 * Convert YYYY-MM-DD string to Date object (UTC, no time component)
 */
export function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Format Date object to YYYY-MM-DD string (UTC)
 */
export function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD string (UTC)
 */
export function getToday() {
  const now = new Date();
  return formatDate(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())));
}

/**
 * Add days to a date
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get number of days in a year
 */
export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Get day of year (0-based) for a date
 */
export function getDayOfYear(date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get date from year and day-of-year (0-based)
 */
export function getDateFromDayOfYear(year, dayOfYear) {
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(date.getUTCDate() + dayOfYear);
  return date;
}

/**
 * Calculate age in years (decimal) from birthday to a given date
 */
export function calculateAge(birthday, currentDate) {
  const birthTime = birthday.getTime();
  const currentTime = currentDate.getTime();
  const diff = currentTime - birthTime;
  const years = diff / (1000 * 60 * 60 * 24 * 365.25);
  return years;
}

/**
 * Check if date is in the past (or today)
 */
export function isPast(date, today) {
  return date <= today;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}

/**
 * Get the start of a week (Monday) for a given date
 */
export function getWeekStart(date) {
  const result = new Date(date);
  const day = result.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
  result.setUTCDate(result.getUTCDate() + diff);
  return result;
}

/**
 * Map day-of-year to slot index for 2-row layout with 184 columns
 * Returns null for inactive slots (Feb 29 on non-leap years)
 */
export function dayToSlotIndex(year, dayOfYear) {
  // Feb 29 is always at slot 59 (day 59 of year, 0-indexed)
  // On non-leap years, slot 59 is inactive
  if (dayOfYear === 59 && !isLeapYear(year)) {
    return null; // This day doesn't exist in non-leap years
  }

  // For days after Feb 29 in non-leap years, no shift needed
  // because we have a fixed slot layout
  return dayOfYear;
}

/**
 * Map slot index to day-of-year (0-based) for a given year
 * Returns null if the slot is inactive
 */
export function slotToDayOfYear(year, slotIndex) {
  // Slot 59 is Feb 29 - inactive on non-leap years
  if (slotIndex === 59 && !isLeapYear(year)) {
    return null;
  }

  // After Feb 29, same mapping
  return slotIndex;
}
