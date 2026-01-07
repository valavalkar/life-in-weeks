import React, { useMemo } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

// Memoized week cell component
const WeekCell = React.memo(({ week, calendarYear, age }) => {
  const style = {
    width: '20px',
    height: '20px',
    border: '1px solid #000',
    borderRadius: '2px',
    backgroundColor: week.color
      ? week.color
      : week.lived
      ? '#68D391'
      : '#EDF2F7',
    boxSizing: 'border-box',
  };

  const percentComplete = ((age / 90) * 100).toFixed(2);

  const tooltipContent = (
    <div>
      {week.label && (
        <>
          <strong>{week.label}</strong>
          <br />
        </>
      )}
      <strong>Calendar Year:</strong> {calendarYear}
      <br />
      <strong>Week in Year:</strong> {week.weekNum}
      <br />
      <strong>Age:</strong> {week.age.toFixed(2)}
      <br />
      <strong>Percent Complete:</strong> {percentComplete}%
      <br />
      <strong>From:</strong> {week.startDate}
      <br />
      <strong>To:</strong> {week.endDate}
    </div>
  );

  return (
    <Tippy content={tooltipContent}>
      <div style={style} />
    </Tippy>
  );
});

WeekCell.displayName = 'WeekCell';

function WeeksGrid({ yearsData, birthday }) {
  const birthdayYear = useMemo(() => parseInt(birthday.split('-')[0]), [birthday]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: '10px',
      }}
    >
      {/* Week labels (1-52) */}
      <div style={{ display: 'flex', marginBottom: '2px' }}>
        <div style={{ width: '50px' }} />
        {Array.from({ length: 52 }, (_, i) => (
          <div key={i} style={{ width: '20px', textAlign: 'center' }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Year and weeks layout */}
      {yearsData.map(({ year, weeks }) => {
        const age = year - birthdayYear;
        return (
          <div key={year} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '25px',
                textAlign: 'right',
                paddingRight: '5px',
              }}
            >
              {year}
            </div>
            <div
              style={{
                width: '25px',
                textAlign: 'right',
                paddingRight: '5px',
                color: 'grey',
              }}
            >
              {age}
            </div>
            {weeks.map((week, weekIndex) => (
              <WeekCell
                key={`${year}-${weekIndex}`}
                week={week}
                calendarYear={year}
                age={week.age}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(WeeksGrid);
