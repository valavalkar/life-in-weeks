import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional for styles
import { DateTime } from 'luxon';

function Week({ lived, color, startDate, endDate, weekNumberInYear }) {
  const style = {
    width: '20px',
    height: '20px',
    border: '1px solid #000',
    borderRadius: '2px',
    backgroundColor: color ? color : (lived ? '#68D391' : '#EDF2F7'),
    boxSizing: 'border-box',
  };

  const startDateTime = DateTime.fromISO(startDate);
  const birthday = DateTime.fromISO("2001-12-14");
  const weekInLife = startDateTime.diff(birthday, 'weeks').weeks + 1;

  const age = startDateTime.diff(birthday, 'years').years;
  const percentage = age / 90 * 100;

  const tooltipContent = (
    <div>
      <strong>Week:</strong> {weekInLife}<br/>
	  <strong>Age:</strong> {age}<br/>
	  <strong>Percent Complete:</strong> {percentage}<br/>
      <strong>From:</strong> {startDate.toISODate()}<br/>
      <strong>To:</strong> {endDate.toISODate()}
    </div>
  );

  return (
    <Tippy content={tooltipContent}>
      <div style={style} />
    </Tippy>
  );
}

export default Week;
