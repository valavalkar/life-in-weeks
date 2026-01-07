import React, { useMemo } from 'react';
import WeeksGrid from './WeeksGrid';
import DaysCanvas from './DaysCanvas';
import { precomputeDaysData, precomputeWeeksData } from '../lib/gridData';

function LifeTable({ birthday, highlightCriteria, viewMode = 'weeks', currentDate }) {
  // Use current date or fallback
  const today = currentDate || new Date().toISOString().split('T')[0];

  // Precompute data once - this is FAST and only depends on these inputs
  const weeksData = useMemo(() => {
    return precomputeWeeksData(birthday, today, highlightCriteria);
  }, [birthday, today, highlightCriteria]);

  const daysData = useMemo(() => {
    return precomputeDaysData(birthday, today, highlightCriteria);
  }, [birthday, today, highlightCriteria]);

  // Render appropriate view - switching is INSTANT because data is precomputed
  if (viewMode === 'days') {
    return <DaysCanvas yearsData={daysData} birthday={birthday} />;
  } else {
    return <WeeksGrid yearsData={weeksData} birthday={birthday} />;
  }
}

export default LifeTable;
