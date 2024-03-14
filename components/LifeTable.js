import React from 'react';
import Week from './Week';
import { DateTime } from 'luxon';

function LifeWeeksTable({ birthday }) {
  const birthdayDate = DateTime.fromISO(birthday);
  const now = DateTime.now();
  const maxAge = 90; // maximum age to display

  const years = [];

  // Calculate the date of the 14th of December for each year within the range
for (let year = birthdayDate.year; year < birthdayDate.year + maxAge; year++) {
    let weeksOfYear = [];
    let endOfYear = DateTime.fromObject({ year, month: 12, day: 31 });
    let weekCount = endOfYear.weekNumber === 1 ? endOfYear.minus({ weeks: 1 }).weekNumber : endOfYear.weekNumber; // Determine the number of weeks in the year
    for (let week = 1; week <= weekCount; week++) {
      let weekDate = DateTime.fromObject({ year }).set({ weekNumber: week });
      weeksOfYear.push({
        date: weekDate,
        isLived: now >= weekDate,
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
        {Array.from({ length: 53 }, (_, i) => (
          <div key={i} style={{ width: '20px', textAlign: 'center' }}>{i + 1}</div>
        ))}
      </div>
      {/* Year and weeks layout */}
      {years.map(({ year, weeks }) => (
        <div key={year} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '25px', textAlign: 'right', paddingRight: '5px' }}>{year}</div>
          <div style={{ width: '25px', textAlign: 'right', paddingRight: '5px', color: 'grey' }}>{year - birthdayDate.year}</div>
          {weeks.map((week, weekIndex) => (
            <Week key={`${year}-${weekIndex + 1}`} lived={week.isLived} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default LifeWeeksTable;
