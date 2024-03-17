import React from 'react';
import Week from './Week';
import { DateTime } from 'luxon';

// Utility function to determine the color of a week based on given criteria
function getColorForWeek(weekStartDate, weekEndDate, highlightCriteria) {
  for (let i = 0; i < highlightCriteria.length; i++) {
    const { start, end, date, color } = highlightCriteria[i];
    if (start && end) { // Check for a date range
      if ((weekStartDate >= DateTime.fromISO(start) && weekStartDate < DateTime.fromISO(end)) || (weekEndDate > DateTime.fromISO(start) && weekEndDate <= DateTime.fromISO(end))) {
        return color;
      }
    } else if (date) { // Check for a specific date
      if (weekStartDate <= DateTime.fromISO(date) && weekEndDate > DateTime.fromISO(date)) {
        return color;
      }
    }
  }
  return null; // Default case, no special coloring
}

function LifeWeeksTable({ birthday, highlightCriteria }) {
  const birthdayDate = DateTime.fromISO(birthday);
  const now = DateTime.now();
  const maxAge = 90; // Maximum age to display

  const years = [];
  let weekNumberOverall = 1;

  for (let year = birthdayDate.year; year <= birthdayDate.year + maxAge; year++) {
    let weeksOfYear = [];
    let thisBirthday = DateTime.fromObject({ year, month: birthdayDate.month, day: birthdayDate.day });
    let nextBirthday = thisBirthday.plus({ years: 1 });

    let currentWeekStart = thisBirthday;

    for (let week = 1; week < 52; week++) {
      let nextWeekStart = currentWeekStart.plus({ days: 7 });
      let color = getColorForWeek(currentWeekStart, nextWeekStart, highlightCriteria);
      let lived = nextWeekStart <= now;

      weeksOfYear.push({
        startDate: currentWeekStart,
        endDate: nextWeekStart,
        weekNumberInYear: week,
        weekNumberOverall: weekNumberOverall++,
        color,
        lived
      });

      currentWeekStart = nextWeekStart;
    }

    // Adjust for the last week if it goes into the next year
    if (currentWeekStart < nextBirthday) {
      let color = getColorForWeek(currentWeekStart, nextBirthday, highlightCriteria);
      let lived = nextBirthday <= now;
      weeksOfYear.push({
        startDate: currentWeekStart,
        endDate: nextBirthday,
        weekNumberInYear: weeksOfYear.length + 1,
        weekNumberOverall,
        color,
        lived
      });
    }

    years.push({
      year: year,
      weeks: weeksOfYear,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '10px' }}>
      {/* Week labels (1-52 or 53) */}
      <div style={{ display: 'flex', marginBottom: '2px' }}>
        <div style={{ width: '50px' }} /> {/* Placeholder for the year and age columns */}
        {Array.from({ length: 52 }, (_, i) => (
          <div key={i} style={{ width: '20px', textAlign: 'center' }}>{i + 1}</div>
        ))}
      </div>
      {/* Year and weeks layout */}
      {years.map(({ year, weeks }) => (
        <div key={year} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '25px', textAlign: 'right', paddingRight: '5px' }}>{year}</div>
          <div style={{ width: '25px', textAlign: 'right', paddingRight: '5px', color: 'grey' }}>{year - birthdayDate.year}</div>
          {weeks.map((week, weekIndex) => (
            <Week
              key={`${year}-${weekIndex + 1}`}
              lived={week.lived}
              color={week.color}
              startDate={week.startDate}
              endDate={week.endDate}
              weekNumberInYear={week.weekNumberInYear}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default LifeWeeksTable;
