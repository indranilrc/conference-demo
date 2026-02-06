# Conference Website - Project Memory

**Last Updated:** February 4, 2026
**Status:** Production Ready
**Version:** 1.0

## Project Overview

A complete, responsive conference website with CSV-based event management system. Features include homepage with conference info, multiple filtered event views, and a professional multi-track schedule display matching industry-standard conference agenda layouts.

## Current Architecture

### Data Layer

**CSV Schema (`data/events.csv`):**
```csv
id,type,title,abstract,date,startTime,endTime,track,speakers,moderators,location,room
```

**Fields:**
- `id` - Unique integer identifier
- `type` - Event category: panel, keynote, workshop, tutorial
- `title` - Session title
- `abstract` - Detailed description
- `date` - Format: YYYY-MM-DD (e.g., 2023-10-01)
- `startTime` - Format: HH:MM (24-hour, e.g., 09:00)
- `endTime` - Format: HH:MM (24-hour, e.g., 10:30)
- `track` - Track identifier for parallel sessions (A, B, C, etc.) - empty for plenary
- `speakers` - Pipe-separated list (e.g., "Dr. Jane Doe|John Smith")
- `moderators` - Pipe-separated list (same format as speakers)
- `location` - Venue location (e.g., "Main Conference Hall")
- `room` - Specific room (e.g., "Room 101", "Auditorium")

**Current Dataset:** 15 events across 3 days with parallel tracks

**Configuration (`data/conference-info.json`):**
```json
{
  "name": "Conference name",
  "dates": "Display dates",
  "location": "City, State",
  "venue": "Venue name",
  "about": "Description text",
  "callForPapers": "CFP text",
  "chairs": [
    {"name": "...", "affiliation": "...", "role": "..."}
  ]
}
```

### JavaScript Modules

**1. CSV Parser (`js/csv-parser.js`)**
- `loadEvents(csvPath)` → Promise<Event[]> - Loads and parses CSV using PapaParse
- `filterEvents(events, filters)` - Filters by type, date, track
- `groupByDayAndTime(events)` - Groups for multi-track display
- `getUniqueDates(events)` - Extracts sorted unique dates
- `getUniqueTypes(events)` - Extracts unique event types
- `formatDate(dateString)` - Formats as "Wednesday, October 1, 2023"
- `formatTime(time)` - Converts "09:00" to "9:00 AM"

**2. Event Renderer (`js/event-renderer.js`)**
- `renderEventList(events, containerId)` - Renders list view
- `renderEventCard(event, index)` - Creates individual card HTML
- `renderSpeakerInfo(event)` - Formats speaker display
- `renderModeratorInfo(event)` - Formats moderator display
- `renderEventDetails(event)` - Creates expandable details section
- `getEventIcon(type)` - Returns emoji for event type
- `attachExpandHandlers()` - Adds click-to-expand functionality
- `renderFilters(events, options)` - Creates filter dropdowns

**3. Navigation (`js/navigation.js`)**
- `renderNavigation(currentPage)` - Generates consistent nav HTML
- Requires `currentPageId` variable on each page
- Auto-initializes on DOMContentLoaded

### Page Structure

**Homepage (`index.html`)**
- Hero section (dynamic from JSON)
- Call for Papers
- About the Conference
- Conference Chairs (grid layout)
- Venue information
- Footer
- Navigation integration

**Event Pages (events/*.html)**
- `all.html` - All events with type + date filters
- `panels.html` - Pre-filtered to panels only
- `keynotes.html` - Pre-filtered to keynotes only
- `workshops.html` - Pre-filtered to workshops + tutorials

**Multi-Track Schedule (`multitrack.html`)**
- Professional conference schedule layout
- Day tabs for navigation
- Grid layout: Time column (120px) + Sessions
- Time cells: Dark blue (#1e4d8b), shows time in HHMM format
- Session cards: Gray (#d9d9d9) with colored type badges
- Plenary sessions span full width
- Parallel tracks display side-by-side

**Key Dates (`key-dates.html`)**
- Timeline layout with 7 milestone dates
- Visual distinction for past vs. upcoming dates

### Styling System

**Color Palette:**
- Primary: #667eea (purple gradient base)
- Navy: #1e4d8b (time cells, session IDs)
- Dark: #2c3e50 (text, headings)
- Light gray: #d9d9d9 (session cards)
- Background: #f5f5f5

**Session Type Colors:**
- Panel: #1e4d8b (navy)
- Keynote: #5c6bc0 (purple)
- Workshop: #26a69a (teal)
- Tutorial: #ab47bc (magenta)

**Responsive Breakpoints:**
- 768px - Tablet adjustments (nav collapse, grid changes)
- 600px - Mobile layout
- 480px - Compact mobile

**Key CSS Classes:**
- `.agenda-container` - Max-width 1000px, centered
- `.session-card` - Event card styling with hover effects
- `.time-row` - Grid row for schedule (120px + 1fr)
- `.day-tab` - Tab navigation for days
- `.session-type-badge` - Colored badges for event types
- `.plenary` - Full-width session modifier

## Multi-Track Schedule Implementation

### Layout Logic

**Time Display:**
```javascript
// Format "09:00" → "0900" for display
const timeDisplay = slot.startTime.replace(':', '');
```

**Session ID Generation:**
```javascript
// Creates IDs like "PA01", "KE02", "WO03"
const sessionId = `${event.type.substring(0, 2).toUpperCase()}${String(event.id).padStart(2, '0')}`;
```

**Plenary Detection:**
```javascript
// Single session in time slot + (keynote OR no track) = plenary
const isPlenary = slot.events.length === 1 &&
    (slot.events[0].type === 'keynote' || !slot.events[0].track);
```

**Grid Columns:**
- Default: `repeat(auto-fit, minmax(300px, 1fr))` - Responsive columns
- Plenary: `grid-column: 1 / -1` - Spans all columns

### Session Card Structure
```html
<div class="session-card {type} [plenary]">
  <div class="session-type-badge">{TYPE}</div>
  <div class="session-id">{ID} {Title}</div>
  <div class="session-meta">
    <div>📍 {Room}</div>
    <div>🕒 {Time}</div>
  </div>
  <div class="session-description">{Abstract}</div>
  <div class="session-people">
    {Speakers/Panelists list}
    {Moderator}
  </div>
</div>
```

## File Dependencies

### Load Order for Event Pages
```html
<script src="../lib/papaparse.min.js"></script>      <!-- 1. CSV parser -->
<script src="../js/csv-parser.js"></script>          <!-- 2. CSV utilities -->
<script src="../js/event-renderer.js"></script>      <!-- 3. Rendering -->
<script src="../js/navigation.js"></script>          <!-- 4. Navigation -->
<script>/* Page-specific logic */</script>           <!-- 5. Page code -->
```

### Required Variables
Each page must define:
```javascript
const currentPageId = 'page-name'; // Before navigation.js loads
```

Values: 'home', 'dates', 'events-all', 'events-panels', 'events-keynotes', 'events-workshops', 'multitrack'

## Data Management

### Adding New Events
1. Open `data/events.csv`
2. Add new row with incremented ID
3. Use pipe `|` separator for multiple speakers/moderators
4. Set track (A, B, C...) for parallel sessions, leave empty for plenary
5. Save file - changes appear immediately on refresh

### Parallel Sessions Setup
Events with **same date and time** but **different tracks** display side-by-side:
```csv
5,panel,...,2023-10-02,09:00,10:30,A,...  ← Track A
6,panel,...,2023-10-02,09:00,10:30,B,...  ← Track B (shows next to Track A)
```

### Plenary Sessions Setup
Leave track empty for full-width display:
```csv
2,keynote,...,2023-10-01,10:30,11:30,,...  ← No track = plenary
```

## Current Event Schedule

### Day 1: Sunday, October 1, 2023
- 09:00-10:00: Panel (Track A) - Future of Energy Systems
- 10:30-11:30: Keynote - Opening Keynote
- 13:00-15:00: Workshop - Renewable Energy Modeling
- 15:30-17:00: Panel (Track B) - Subsurface Innovations

### Day 2: Monday, October 2, 2023 (Parallel Tracks)
- 09:00-10:30: Panel (A) - Carbon Capture | Panel (B) - Hydrogen Economy
- 11:00-12:00: Keynote - The Path to Net Zero
- 13:30-15:30: Tutorial (A) - Energy Economics | Workshop (B) - Data Analytics
- 16:00-17:30: Panel (A) - Digital Transformation | Panel (B) - Energy Policy

### Day 3: Tuesday, October 3, 2023
- 09:00-10:30: Keynote - Energy Innovation Showcase
- 11:00-12:30: Panel (A) - Offshore Wind | Panel (B) - Battery Storage
- 14:00-15:00: Keynote - Closing Remarks

## Features Implemented

✅ CSV-based event management (easy updates via spreadsheet)
✅ Dynamic homepage with JSON configuration
✅ Multiple filtered event views (all, panels, keynotes, workshops)
✅ Professional multi-track schedule grid
✅ Day tab navigation
✅ Responsive design (desktop/tablet/mobile)
✅ Expandable event details
✅ Event type badges with color coding
✅ Speaker/moderator display
✅ Location and room information
✅ Timeline-style key dates page
✅ Consistent navigation across all pages
✅ Auto-detecting plenary vs. parallel sessions

## Browser Support

- Modern browsers with ES6+ support
- Fetch API for JSON loading
- CSS Grid and Flexbox
- PapaParse library handles CSV parsing

## Development Workflow

### Local Server
```bash
python3 -m http.server 8000
# OR
npx http-server
```

### Testing Checklist
- [ ] All pages load without console errors
- [ ] CSV events display on all event pages
- [ ] Filters work (type, date)
- [ ] Multi-track view shows parallel sessions correctly
- [ ] Day tabs switch properly
- [ ] Navigation menu works on all pages
- [ ] Mobile responsive design functions
- [ ] Homepage loads conference info from JSON

### Verification Script
```bash
./verify.sh  # Checks all files exist and validates data
```

## Extension Points

### Adding New Event Types
1. Add type to CSV (e.g., "poster", "social")
2. Add color in `multitrack.html` style section:
   ```css
   .session-type-badge.poster { background: #ff9800; }
   ```
3. Add icon in `event-renderer.js`:
   ```javascript
   'poster': '📊'
   ```

### Adding New Pages
1. Create HTML file
2. Define `currentPageId` variable
3. Load required scripts in order
4. Update `navigation.js` to include new page
5. Add link to navigation menu

### Adding Search Functionality
Location: Before filters in event pages
```javascript
// Add to event pages
<input type="text" id="searchBox" placeholder="Search sessions...">

// In JavaScript
const searchTerm = searchBox.value.toLowerCase();
const filtered = events.filter(e =>
  e.title.toLowerCase().includes(searchTerm) ||
  e.abstract.toLowerCase().includes(searchTerm)
);
```

## Known Limitations

1. **CORS**: Requires web server (not file://) for CSV/JSON loading
2. **Client-side only**: No backend, all processing in browser
3. **No authentication**: Public access only
4. **No database**: CSV is the source of truth
5. **Manual updates**: No admin interface

## Performance Notes

- PapaParse library: ~20KB minified
- CSV parsing: Near-instantaneous for <100 events
- All filtering client-side: Fast for typical conference sizes (<500 events)
- Images: Placeholder only, add real speaker photos as needed

## Backup & Version Control

**Important Files to Back Up:**
- `data/events.csv` - Primary event data
- `data/conference-info.json` - Conference configuration
- `style.css` - Custom styling
- All HTML files

**Git Ignore:**
- `.DS_Store`
- `*.ipynb` (unrelated notebooks)
- Old files: `04-website.html`, `05-variables.html`, `agenda.html`, `agenda.js`, `data/events.js`

## Migration Notes

**From Old System:**
- Replaced `data/events.js` with `data/events.csv`
- Updated `multitrack.html` to use CSV instead of inline data
- Removed inline data arrays (lines 124-173 in old version)
- Unified styling across all pages

## Quick Reference

### Common Tasks

**Update conference name:**
Edit `data/conference-info.json` → "name" field

**Add parallel sessions:**
Same date/time, different track letters (A, B, C...)

**Make session full-width:**
Leave track field empty in CSV

**Change colors:**
Edit CSS variables in `multitrack.html` <style> section and `style.css`

**Add new day:**
Add events with new date to CSV, tabs auto-generate

### File Paths
- Homepage: `/index.html`
- All events: `/events/all.html`
- Multi-track: `/multitrack.html`
- CSV data: `/data/events.csv`
- Config: `/data/conference-info.json`

## Support Resources

- `README.md` - Project overview
- `QUICKSTART.md` - Setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Detailed implementation notes
- `verify.sh` - Verification script

---

**End of Project Memory - v1.0**
