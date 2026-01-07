import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styles

function Week({ lived, color, startDate, endDate, weekNumberInYear, label, age, calendarYear, viewMode = 'weeks', dayOfYear }) {
  const isWeeksView = viewMode === 'weeks';

  const style = {
    width: isWeeksView ? '20px' : '5px',
    height: isWeeksView ? '20px' : '5px',
    border: isWeeksView ? '1px solid #000' : 'none',
    borderRadius: '2px',
    backgroundColor: color ? color : (lived ? '#68D391' : '#EDF2F7'),
    boxSizing: 'border-box',
    margin: isWeeksView ? '0' : '0.5px',
  };

  // Calculate percentage complete
  const percentComplete = (age / 90 * 100).toFixed(2);

  const tooltipContent = isWeeksView ? (
    <div>
      {label && <><strong>{label}</strong><br/></>}
      <strong>Calendar Year:</strong> {calendarYear}<br/>
      <strong>Week in Year:</strong> {weekNumberInYear}<br/>
      <strong>Age:</strong> {age.toFixed(2)}<br/>
      <strong>Percent Complete:</strong> {percentComplete}%<br/>
      <strong>From:</strong> {startDate.toISODate()}<br/>
      <strong>To:</strong> {endDate.toISODate()}
    </div>
  ) : (
    <div>
      {label && <><strong>{label}</strong><br/></>}
      <strong>Date:</strong> {startDate.toISODate()}<br/>
      <strong>Calendar Year:</strong> {calendarYear}<br/>
      <strong>Day of Year:</strong> {dayOfYear}<br/>
      <strong>Age:</strong> {age.toFixed(2)}<br/>
      <strong>Percent Complete:</strong> {percentComplete}%
    </div>
  );

  return (
    <Tippy content={tooltipContent}>
      <div style={style} />
    </Tippy>
  );
}

export default Week;
