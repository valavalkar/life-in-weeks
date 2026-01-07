/**
 * Precompute grid data for weeks and days views
 * This is computed once and reused for instant view switching
 */

import {
  parseDate,
  formatDate,
  addDays,
  getDaysInYear,
  getDayOfYear,
  getDateFromDayOfYear,
  calculateAge,
  isPast,
  isSameDay,
  isLeapYear,
} from './dateMath';

const COLUMNS_PER_ROW = 184; // 184 columns × 2 rows = 368 slots per year
const MAX_AGE = 90;

/**
 * Check if a date matches any highlight criteria
 */
function matchesHighlight(date, highlightCriteria) {
  const dateStr = formatDate(date);

  for (const criteria of highlightCriteria) {
    if (criteria.date && criteria.date === dateStr) {
      return { color: criteria.color, label: criteria.label };
    }
    if (criteria.start && criteria.end) {
      if (dateStr >= criteria.start && dateStr < criteria.end) {
        return { color: criteria.color, label: criteria.label };
      }
    }
  }
  return null;
}

/**
 * Precompute days grid data
 */
export function precomputeDaysData(birthdayStr, todayStr, highlightCriteria) {
  const birthday = parseDate(birthdayStr);
  const today = parseDate(todayStr);
  const startYear = birthday.getUTCFullYear();
  const endYear = startYear + MAX_AGE;

  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    const daysInYear = getDaysInYear(year);
    const cells = [];

    // Always create 368 slots (2 rows × 184 columns)
    for (let slotIndex = 0; slotIndex < 368; slotIndex++) {
      let cell;

      if (slotIndex >= daysInYear) {
        // Inactive slot beyond end of year
        cell = {
          slotIndex,
          isActive: false,
        };
      } else {
        const date = getDateFromDayOfYear(year, slotIndex);

        // Skip if before birthday in birth year
        if (year === birthday.getUTCFullYear() && date < birthday) {
          cell = {
            slotIndex,
            isActive: false,
          };
        } else {
          const age = calculateAge(birthday, date);
          const lived = isPast(date, today);
          const isToday = isSameDay(date, today);
          const dayOfYear = slotIndex + 1; // 1-based for display
          const highlight = matchesHighlight(date, highlightCriteria);

          let color = null;
          let label = null;

          if (isToday) {
            color = 'red';
            label = 'Today';
          } else if (highlight) {
            color = highlight.color;
            label = highlight.label;
          }

          cell = {
            slotIndex,
            isActive: true,
            dateStr: formatDate(date),
            year,
            dayOfYear,
            age,
            lived,
            isToday,
            color,
            label,
          };
        }
      }

      cells.push(cell);
    }

    years.push({
      year,
      age: year - startYear,
      isLeapYear: isLeapYear(year),
      cells,
    });
  }

  return years;
}

/**
 * Precompute weeks grid data
 */
export function precomputeWeeksData(birthdayStr, todayStr, highlightCriteria) {
  const birthday = parseDate(birthdayStr);
  const today = parseDate(todayStr);
  const startYear = birthday.getUTCFullYear();
  const endYear = startYear + MAX_AGE;

  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    const weeks = [];

    // Calendar year: Jan 1 to Dec 31
    let yearStart = new Date(Date.UTC(year, 0, 1));
    const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

    // If birth year, start from birthday
    if (year === birthday.getUTCFullYear()) {
      yearStart = birthday;
    }

    let currentWeekStart = yearStart;

    // Generate 52 weeks
    for (let weekNum = 0; weekNum < 52; weekNum++) {
      let nextWeekStart = addDays(currentWeekStart, 7);

      // Last week ends at year end
      if (weekNum === 51) {
        nextWeekStart = new Date(yearEnd.getTime() + 1); // Day after year end
      }

      const weekEnd = addDays(nextWeekStart, -1);
      const age = calculateAge(birthday, currentWeekStart);
      const lived = isPast(weekEnd, today);

      // Check if current week
      const isCurrentWeek = currentWeekStart <= today && today < nextWeekStart;

      // Check highlights
      let color = null;
      let label = null;

      if (isCurrentWeek) {
        color = 'red';
        label = 'This Week';
      } else {
        // Check if any day in the week matches highlight criteria
        for (let d = 0; d < 7; d++) {
          const checkDate = addDays(currentWeekStart, d);
          if (checkDate >= nextWeekStart) break;

          const highlight = matchesHighlight(checkDate, highlightCriteria);
          if (highlight) {
            color = highlight.color;
            label = highlight.label;
            break;
          }
        }
      }

      weeks.push({
        weekNum: weekNum + 1,
        startDate: formatDate(currentWeekStart),
        endDate: formatDate(weekEnd),
        age,
        lived,
        color,
        label,
      });

      currentWeekStart = nextWeekStart;
    }

    years.push({
      year,
      age: year - startYear,
      weeks,
    });
  }

  return years;
}
