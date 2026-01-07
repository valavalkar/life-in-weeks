import React, { useRef, useEffect, useState, useCallback } from 'react';

const CELL_SIZE = 4; // 4x4px cells
const CELL_GAP = 1; // 1px gap between cells
const CELL_WITH_GAP = CELL_SIZE + CELL_GAP;
const COLUMNS = 184;
const ROWS_PER_YEAR = 2;
const DECADE_GAP = 20; // Extra gap between decades
const YEAR_LABEL_WIDTH = 60; // Space for year + age labels

/**
 * Canvas renderer for days view
 * Renders entire grid to canvas for performance
 */
function DaysCanvas({ yearsData, birthday }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const cellRectsRef = useRef([]); // Precomputed cell rectangles

  // Colors
  const COLORS = {
    red: '#FF0000',
    blue: '#0000FF',
    orange: '#FFA500',
    green: '#00FF00',
    lived: '#68D391',
    future: '#EDF2F7',
  };

  // Precompute cell rectangles for hit-testing
  useEffect(() => {
    const cellRects = [];
    let yOffset = 0;

    yearsData.forEach((yearData, yearIndex) => {
      const { year, cells } = yearData;

      // Add decade gap
      const isDecadeStart = year % 10 === 0 && yearIndex > 0;
      if (isDecadeStart) {
        yOffset += DECADE_GAP;
      }

      // Process cells in 2 rows
      for (let rowInYear = 0; rowInYear < ROWS_PER_YEAR; rowInYear++) {
        const startSlot = rowInYear * COLUMNS;
        const endSlot = Math.min(startSlot + COLUMNS, cells.length);

        for (let slotInRow = 0; slotInRow < COLUMNS; slotInRow++) {
          const slotIndex = startSlot + slotInRow;
          if (slotIndex >= cells.length) break;

          const cell = cells[slotIndex];
          if (!cell.isActive) continue;

          const x = YEAR_LABEL_WIDTH + slotInRow * CELL_WITH_GAP;
          const y = yOffset + rowInYear * CELL_WITH_GAP;

          cellRects.push({
            x,
            y,
            width: CELL_SIZE,
            height: CELL_SIZE,
            cell,
            year,
          });
        }
      }

      yOffset += ROWS_PER_YEAR * CELL_WITH_GAP;
    });

    cellRectsRef.current = cellRects;
  }, [yearsData]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Calculate canvas dimensions
    let maxHeight = 0;
    let yOffset = 0;

    yearsData.forEach((yearData, yearIndex) => {
      const isDecadeStart = yearData.year % 10 === 0 && yearIndex > 0;
      if (isDecadeStart) {
        yOffset += DECADE_GAP;
      }
      yOffset += ROWS_PER_YEAR * CELL_WITH_GAP;
    });

    maxHeight = yOffset;

    const canvasWidth = YEAR_LABEL_WIDTH + COLUMNS * CELL_WITH_GAP;
    const canvasHeight = maxHeight;

    // Set canvas size (accounting for DPR)
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    yOffset = 0;

    yearsData.forEach((yearData, yearIndex) => {
      const { year, age, cells } = yearData;

      // Add decade gap
      const isDecadeStart = year % 10 === 0 && yearIndex > 0;
      if (isDecadeStart) {
        yOffset += DECADE_GAP;
      }

      // Draw year label
      ctx.fillStyle = '#000';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(year, 38, yOffset + 8);

      // Draw age label
      ctx.fillStyle = '#888';
      ctx.font = '8px sans-serif';
      ctx.fillText(age, 55, yOffset + 8);

      // Draw cells in 2 rows
      for (let rowInYear = 0; rowInYear < ROWS_PER_YEAR; rowInYear++) {
        const startSlot = rowInYear * COLUMNS;
        const endSlot = Math.min(startSlot + COLUMNS, cells.length);

        for (let slotInRow = 0; slotInRow < COLUMNS; slotInRow++) {
          const slotIndex = startSlot + slotInRow;
          if (slotIndex >= cells.length) break;

          const cell = cells[slotIndex];
          if (!cell.isActive) continue;

          const x = YEAR_LABEL_WIDTH + slotInRow * CELL_WITH_GAP;
          const y = yOffset + rowInYear * CELL_WITH_GAP;

          // Determine color
          let fillColor;
          if (cell.color) {
            fillColor = COLORS[cell.color] || cell.color;
          } else {
            fillColor = cell.lived ? COLORS.lived : COLORS.future;
          }

          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }

      yOffset += ROWS_PER_YEAR * CELL_WITH_GAP;
    });
  }, [yearsData]);

  // Mouse move handler with hit-testing
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find hovered cell using precomputed rects
    let found = null;
    for (const cellRect of cellRectsRef.current) {
      if (
        x >= cellRect.x &&
        x <= cellRect.x + cellRect.width &&
        y >= cellRect.y &&
        y <= cellRect.y + cellRect.height
      ) {
        found = cellRect;
        break;
      }
    }

    if (found) {
      setHoveredCell(found.cell);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredCell(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  return (
    <div ref={containerRef} style={{ overflowX: 'auto', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'block', cursor: 'crosshair' }}
      />

      {/* Single tooltip rendered as absolutely positioned div */}
      {hoveredCell && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPos.x + 10,
            top: tooltipPos.y + 10,
            backgroundColor: '#333',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            maxWidth: '250px',
          }}
        >
          {hoveredCell.label && (
            <>
              <strong>{hoveredCell.label}</strong>
              <br />
            </>
          )}
          <strong>Date:</strong> {hoveredCell.dateStr}
          <br />
          <strong>Calendar Year:</strong> {hoveredCell.year}
          <br />
          <strong>Day of Year:</strong> {hoveredCell.dayOfYear}
          <br />
          <strong>Age:</strong> {hoveredCell.age.toFixed(2)}
          <br />
          <strong>Percent Complete:</strong> {((hoveredCell.age / 90) * 100).toFixed(2)}%
        </div>
      )}
    </div>
  );
}

export default DaysCanvas;
