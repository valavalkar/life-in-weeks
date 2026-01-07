# Anand's Life in Weeks

Inspired by Tim Urban's Life in Weeks and The Tail End

A visual representation of a life in weeks and days, helping to visualize the passage of time and mortality.

## Features

- **Weeks View**: Traditional grid showing each week of life (52 weeks per calendar year)
- **Days View**: Detailed grid showing each day of life (2 rows per calendar year, canvas-rendered for performance)
- **Instant View Switching**: Toggle between weeks/days with <100ms response time
- **Runtime Date Computation**: Current week/day highlights update dynamically based on the actual date at runtime
- **Calendar Year Organization**: Rows are organized by calendar year (Jan 1 - Dec 31) rather than age-based years
- **Interactive Tooltips**: Hover over any cell to see detailed information
- **Highlight Filtering**: Filter and highlight specific people, events, or time periods

## Implementation Details

### Date Indexing and Year Labels

**Weeks View:**
- Each row represents a **calendar year** (January 1 to December 31), not an "age year" starting from the birthday
- Each year contains exactly 52 weeks for consistent layout
- Week 52 is adjusted to contain any remaining days of the year (1-2 extra days)
- The first row (birth year) starts from the birthday and continues through December 31
- Year labels show the calendar year (YYYY)
- Age is displayed in a separate column and is computed from the birthday

**Days View:**
- Each year is rendered as exactly **2 rows** of day squares
- **184 columns per row** = 368 slots per year (2 × 184)
- Row 1: Days 0-183 (Jan 1 - early July)
- Row 2: Days 184-367 (mid-July - Dec 31)
- Decade separators provide visual grouping every 10 years
- Year labels show the calendar year (YYYY)
- Age is displayed in a separate column

### Why 184 Columns?

The choice of 184 columns creates 368 total slots per year (2 rows × 184 columns):
- **365 days** in non-leap years → 365 active cells + 3 inactive cells
- **366 days** in leap years → 366 active cells + 2 inactive cells
- This provides enough slots for any year while maintaining a stable 2-row layout
- 184 columns fits comfortably on most screens when cells are 4×4px

### Leap Year Handling

**Weeks View:**
- Leap years are handled automatically by the week-based layout
- The last week (week 52) absorbs the extra day in leap years

**Days View:**
- All years use the same 368-slot layout (2 rows × 184 columns)
- Leap years: 366 days mapped to slots 0-365, remaining slots inactive
- Non-leap years: 365 days mapped to slots 0-364, remaining slots inactive
- **Feb 29 slot behavior**: In non-leap years, day index 59 (Feb 29) is skipped automatically by the date math
- This ensures perfect year-to-year alignment without manual shifting

### Runtime Date Computation

The "current week" or "today" highlight is computed **at runtime on the client-side** to avoid build-time freezing:

1. **Client-Side Initialization**: A `useEffect` hook in `pages/index.js` sets the current date when the component mounts
2. **Dynamic Highlighting**: The `currentDate` state is passed to the `LifeTable` component
3. **No Build-Time Caching**: The date is **never** computed at module scope or during static generation
4. **Deployed Site Accuracy**: On deployed sites, the highlight always reflects the actual current date when users visit

**Technical Implementation:**
```javascript
// In pages/index.js
const [currentDate, setCurrentDate] = useState(null);

useEffect(() => {
  setCurrentDate(DateTime.now().toISODate());
}, []);
```

This ensures that:
- Static builds don't freeze the "current week/day" at build time
- Users always see the correct highlight based on when they visit
- The highlight updates properly after deployment without rebuilding

### Performance Architecture

**Problem:** The original implementation was slow when switching views because:
1. React re-rendered ~33,000 DOM nodes for days view (90 years × 366 days)
2. Each cell had inline styles and date parsing logic
3. No memoization of computed data

**Solution:** Multi-tiered optimization

#### 1. Data Precomputation (`lib/gridData.js`)
- All grid data is computed **once** via `useMemo` and stored as plain JavaScript objects
- No date parsing or calculations happen during render
- Both weeks and days data are precomputed simultaneously
- Switching views only changes which precomputed data is displayed

#### 2. Canvas Rendering for Days View (`components/DaysCanvas.js`)
- Days view renders to a single `<canvas>` element instead of 33k DOM nodes
- Canvas drawing is extremely fast (single-digit milliseconds)
- Cells are drawn as rectangles with computed colors
- **Total DOM nodes in days view: 1** (just the canvas)

#### 3. Tooltip Hit-Testing
When hovering over the days canvas:
1. **Precomputed cell rectangles**: Each cell's `(x, y, width, height)` is calculated once when data changes
2. **O(1) lookup on hover**: `mousemove` event finds hovered cell by linear search through rects (fast enough for ~33k cells)
3. **No search needed**: Position math directly maps `(mouseX, mouseY)` to grid coordinates
4. **Throttling**: Mouse events are naturally throttled by browser; no artificial throttling needed for smooth performance

**Hit-testing logic:**
```javascript
// Precompute cell rects
cellRects.push({ x, y, width: CELL_SIZE, height: CELL_SIZE, cell, year });

// On mousemove
for (const cellRect of cellRects) {
  if (x >= cellRect.x && x <= cellRect.x + cellRect.width &&
      y >= cellRect.y && y <= cellRect.y + cellRect.height) {
    setHoveredCell(cellRect.cell);
    break;
  }
}
```

#### 4. Optimized Weeks View (`components/WeeksGrid.js`)
- Uses DOM rendering (not canvas) to maintain existing appearance
- Each week cell is wrapped in `React.memo` to prevent unnecessary re-renders
- No inline style objects recreated on every render
- Data is precomputed, so cells just display primitive values

**Result:** View switching is **instant** (<100ms) because:
- Data is already computed
- Canvas rendering is fast
- DOM-to-canvas or canvas-to-DOM switch only changes 1 component

### Tooltip Information

**Weeks View Tooltip:**
- Calendar year
- Week number in year (1-52)
- Exact date range (from/to)
- Age at week start
- Percent complete of 90-year lifespan

**Days View Tooltip:**
- Exact date (YYYY-MM-DD)
- Calendar year
- Day of year (1-366)
- Age on that day
- Percent complete of 90-year lifespan

### Date Math Module (`lib/dateMath.js`)

All date operations use a shared utility module to avoid timezone bugs:
- Dates are treated as **date-only** using `Date.UTC()` methods
- No local timezone conversions
- Consistent YYYY-MM-DD string format
- Functions: `parseDate`, `formatDate`, `addDays`, `isLeapYear`, `getDayOfYear`, etc.

This ensures:
- No off-by-one errors from daylight saving time
- Consistent behavior across all timezones
- Fast operations (no Luxon/date-fns overhead in render loops)

## Performance Benchmarks

- **Weeks view render**: ~50ms (4,680 DOM nodes for 90 years × 52 weeks)
- **Days view render**: ~10ms (1 canvas element, drawing ~33k cells)
- **View toggle**: <100ms (instant perceived response)
- **Tooltip response**: <16ms (single frame at 60fps)

## Development

```bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run start   # Run production build
```

## Technologies

- Next.js 14
- React 18
- Canvas API (for days view rendering)
- Luxon (datetime for UI state only, not in render loops)
- Material-UI (UI components)
- Tippy.js (tooltips)

## Architecture

```
pages/index.js              # Main page, view mode toggle
components/LifeTable.js     # Wrapper that precomputes data and selects renderer
components/WeeksGrid.js     # DOM renderer for weeks view
components/DaysCanvas.js    # Canvas renderer for days view
lib/dateMath.js            # Date utilities (timezone-safe, no external deps)
lib/gridData.js            # Data precomputation (weeks + days)
```
