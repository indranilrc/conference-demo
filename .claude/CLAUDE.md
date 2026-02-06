# Conference Website - Claude Project Memory

**Project Type:** Static conference website with CSV-based event management
**Status:** Production Ready (v2.0 - Whova Integration)
**Last Updated:** February 5, 2026

## Project Overview

Complete, responsive conference website featuring:
- CSV-based event management system (184 events from Whova export)
- Whova agenda import support with automatic format conversion
- Dynamic homepage loaded from JSON configuration
- Multiple filtered event views (all, panels, keynotes, workshops, tutorials, sessions)
- Professional multi-track schedule grid matching industry-standard layouts
- Advanced search and multi-select filtering on schedule page
- Fully responsive design (desktop/tablet/mobile)

### Recent Changes (v2.0 - February 5, 2026)

1. **Whova Data Integration**: Complete migration from sample CSV to real Whova agenda export
   - 184 real conference events spanning multiple days
   - Automatic conversion from Excel to CSV format
   - Support for Whova's field structure (semicolon-separated speakers, HTML descriptions)
   - New fields: Session Chairs, Authors, Tags

2. **Enhanced CSV Parser**:
   - HTML stripping for clean descriptions
   - Datetime parsing (converts "2025-10-25 00:00:00" format)
   - Intelligent event type detection from track names
   - Support for semicolon-separated lists (Whova format vs pipe-separated)

3. **Expanded Event Types**:
   - Added "Sessions" type for general conference sessions
   - Smart type detection: Keynotes, Panels, Workshops, Tutorials, Sessions
   - Color-coded badges: session=#607d8b

### Previous Changes (v1.1 - February 4, 2026)

1. **Multi-Select Event Type Filtering**: Users can now select multiple event types simultaneously
2. **Real-time Search**: Added search bar to multitrack page
3. **Combined Filters**: Search and type filters work together seamlessly
4. **Documentation Consolidation**: Merged QUICK_REFERENCE.md into QUICKSTART.md

## Current State

### Key Files & Structure
```
conference-website/
├── index.html                 # Homepage with hero, about, chairs, venue
├── key-dates.html             # Timeline with 7 important dates
├── multitrack.html            # ⭐ Professional schedule grid (NEW DESIGN)
├── events/
│   ├── all.html              # All events + type/date filters
│   ├── panels.html           # Panels only
│   ├── keynotes.html         # Keynotes only
│   └── workshops.html        # Workshops + tutorials
├── data/
│   ├── whova_agenda.csv      # ⭐ PRIMARY DATA SOURCE (184 events)
│   ├── Whova_agenda_import_2025.xlsx  # Original Whova export
│   └── conference-info.json  # Homepage content & config
├── js/
│   ├── csv-parser.js         # Data loading, filtering, grouping
│   ├── event-renderer.js     # Event card rendering
│   └── navigation.js         # Consistent nav across pages
├── style.css                  # Global styles + responsive design
└── lib/
    └── papaparse.min.js      # CSV parser library (5.4.1)
```

### Data Schema

**whova_agenda.csv format (Whova Export):**
```csv
*Date,*Time Start,*Time End,Tracks (Optional),*Session Title,Room/Location (Optional),Description (Optional),Speakers (Optional),Role: Moderators (Optional),Role: Session Chairs (Optional),Authors (Optional),Recorded Video URL (Optional),Session or Sub-session(Sub) (Optional),Tags (Optional)
2025-10-25 00:00:00,08:00:00,17:00:00,Short Courses,Short Courses (Day 1),Regency AB; Regency EF,"<p>HTML description</p>",Speaker 1; Speaker 2,Moderator Name,Chair Name,Author 1; Author 2,,Session,Tag1; Tag2
```

**Internal Event Object (After Parsing):**
- `id`: Auto-generated integer (1-184)
- `type`: session | keynote | panel | workshop | tutorial (auto-detected from track)
- `title`: Session title
- `abstract`: Description with HTML stripped
- `date`: YYYY-MM-DD format (extracted from datetime)
- `startTime/endTime`: HH:MM (24-hour, converted from HH:MM:SS)
- `track`: Track name (used for type detection)
- `speakers`: Array (semicolon-separated in CSV)
- `moderators`: Array (semicolon-separated in CSV)
- `sessionChairs`: Array (new field from Whova)
- `room`: Room/Location from CSV
- `sessionType`: "Session" or "Sub"
- `tags`: Array (new field from Whova)
- `authors`: Array (new field from Whova)

**conference-info.json:**
```json
{
  "name": "Conference Name",
  "dates": "October 1-3, 2023",
  "location": "City, State",
  "venue": "Venue Name",
  "about": "Description...",
  "callForPapers": "CFP text...",
  "chairs": [{"name": "...", "affiliation": "...", "role": "..."}]
}
```

### JavaScript Architecture

**Load Order (Critical):**
```html
<script src="lib/papaparse.min.js"></script>      <!-- 1. CSV parser -->
<script src="js/csv-parser.js"></script>          <!-- 2. Data utilities -->
<script src="js/event-renderer.js"></script>      <!-- 3. Rendering -->
<script src="js/navigation.js"></script>          <!-- 4. Navigation -->
```

**Key Functions:**

`csv-parser.js`:
- `loadEvents(path)` → Promise<Event[]> (Whova-aware)
- `stripHTML(html)` → string (removes HTML tags from descriptions)
- `extractDate(datetimeStr)` → string (extracts YYYY-MM-DD from datetime)
- `formatTimeStr(timeStr)` → string (converts HH:MM:SS to HH:MM)
- `determineEventType(track, sessionType)` → string (auto-detects event type)
- `filterEvents(events, {type, date, track})` → Event[]
- `groupByDayAndTime(events)` → {day: {time: [events]}}
- `formatDate(str)`, `formatTime(str)` - Display formatting

`event-renderer.js`:
- `renderEventList(events, containerId)` - Renders list view
- `renderEventCard(event, index)` - Creates card HTML
- `attachExpandHandlers()` - Click-to-expand functionality

`navigation.js`:
- `renderNavigation(currentPage)` - Generates nav menu
- Requires: `const currentPageId = 'page-name'` on each page

## Multi-Track Schedule (NEW - February 2026)

### Design Specifications

Completely redesigned to match professional conference layouts:

**Layout:**
- Day tabs at top for navigation between dates
- Grid structure: 120px time column + flexible sessions area
- Time cells: Dark blue (#1e4d8b), display HHMM format (e.g., "0900")
- Session cards: Gray (#d9d9d9) with colored type badges

**Search & Filtering (Multi-Select):**
- Search bar: Real-time search across title, abstract, speakers, moderators, location, and room
- Multi-select type filters: Users can select multiple event types simultaneously
  - Click individual types (Panel, Keynote, Workshop, Tutorial) to toggle selection
  - Click "All" to reset to showing all types
  - Selected filters are highlighted with their respective colors
  - Search and filters work together (search within selected types)
- Filter state persists when switching between days

**Smart Layout Logic:**
1. **Plenary sessions** (keynotes OR single event with no track) → Full width
2. **Parallel sessions** (same time, different tracks) → Side-by-side columns
3. Auto-responsive grid: `repeat(auto-fit, minmax(300px, 1fr))`

**Session Card Components:**
- Type badge (colored: panel=#1e4d8b, keynote=#5c6bc0, workshop=#26a69a, tutorial=#ab47bc)
- Session ID (e.g., "PA01", "KE02")
- Title
- Location/Room (with 📍 icon)
- Time range (with 🕒 icon)
- Abstract/Description
- Speakers list (or Panelists for panels)
- Moderator

**Code Pattern:**
```javascript
// Multi-select filter using Set
let selectedTypes = new Set(['all']);

// Detect plenary
const isPlenary = slot.events.length === 1 &&
    (slot.events[0].type === 'keynote' || !slot.events[0].track);

// Session ID generation
const sessionId = `${event.type.substring(0, 2).toUpperCase()}${String(event.id).padStart(2, '0')}`;

// Filter with search and type
if (!typeFilters.has('all')) {
    dayEvents = dayEvents.filter(e => typeFilters.has(e.type));
}
if (search) {
    dayEvents = dayEvents.filter(e => /* search logic */);
}
```

### Current Schedule Data (184 Real Events from Whova)

**Event Types Distribution:**
- Sessions: Technical papers, doctoral symposium, product showcases, tech demos
- Keynotes: Plenary keynote sessions
- Panels: Panel discussions
- Workshops: Workshop sessions
- Tutorials: Short courses and tutorial sessions

**Tracks:**
- Short Courses
- Keynotes
- Panels
- Workshops
- Tutorials
- Technical Papers
- Doctoral Symposium
- Product Showcases
- Tech Demos
- General (breaks, meals, etc.)

**Date Range:** October 25-29, 2025 (multiple conference days)

## Common Operations

### Add New Event
Edit `data/events.csv`, add row with incremented ID:
```csv
16,panel,New Session,Description,2023-10-03,16:00,17:30,A,Speaker Name,Moderator,Location,Room
```
Refresh browser → changes appear immediately

### Create Parallel Sessions
Same time + different tracks:
```csv
17,panel,Session A,Desc,2023-10-01,14:00,15:30,A,...
18,panel,Session B,Desc,2023-10-01,14:00,15:30,B,...
```
→ Display side-by-side in multi-track view

### Create Plenary Session
Leave track empty:
```csv
19,keynote,Big Talk,Desc,2023-10-01,09:00,10:00,,...
```
→ Full-width display

### Update Conference Info
Edit `data/conference-info.json` fields, refresh homepage

## Styling & Design

**Color Scheme:**
- Primary: #667eea (purple/blue gradient)
- Navy: #1e4d8b (time cells, panel badges, session IDs)
- Dark: #2c3e50 (headings, body text)
- Session cards: #d9d9d9 (light gray background)
- Background: #f5f5f5

**Responsive Breakpoints:**
- Desktop: >768px (120px time column, side-by-side parallels)
- Tablet: 768px (80px time column, stacked sessions)
- Mobile: 480px (60px time column, single column)

**Key CSS Classes:**
- `.time-row` - Grid row: `grid-template-columns: 120px 1fr`
- `.session-card` - Event card with hover effects
- `.session-card.plenary` - Full-width modifier: `grid-column: 1 / -1`
- `.day-tab` - Day navigation tabs
- `.session-type-badge` - Colored type badges

## Development

### Run Locally
```bash
python3 -m http.server 8000
# Open: http://localhost:8000
```

### Verify Installation
```bash
./verify.sh  # Checks all files + validates data
```

### Testing Checklist
- [ ] All pages load without console errors
- [ ] CSV events display correctly
- [ ] Filters work (type, date)
- [ ] Multi-track view shows parallels side-by-side
- [ ] Plenary sessions full-width
- [ ] Day tabs switch properly
- [ ] Navigation menu consistent
- [ ] Mobile responsive
- [ ] Homepage loads JSON config

## Technical Details

**Dependencies:**
- PapaParse 5.4.1 (only external library, ~20KB)
- Modern browser with ES6+ support
- Fetch API for data loading
- CSS Grid & Flexbox

**Browser Support:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Performance:**
- CSV parsing: Near-instant for <100 events
- Client-side filtering: Fast for typical conference sizes
- No backend required

## Known Limitations

1. Requires web server (CORS restrictions prevent file:// protocol)
2. Client-side only - no authentication or backend
3. CSV is source of truth - no database
4. All filtering happens in browser

## Extension Points

### Add New Event Type
1. Add to CSV (e.g., "poster")
2. Add color in multitrack.html: `.session-type-badge.poster { background: #color; }`
3. Add filter button: `<button class="filter-btn poster" data-type="poster">Posters</button>`
4. Add active state CSS: `.filter-btn.poster.active { background: #color; }`
5. Add icon in event-renderer.js: `'poster': '📊'`

### Add Search to Other Pages
The multi-track page has full search implementation. To add to other event pages:
```javascript
// Search across multiple fields
const searchTerm = input.value.toLowerCase();
const filtered = events.filter(e =>
  e.title.toLowerCase().includes(searchTerm) ||
  (e.abstract && e.abstract.toLowerCase().includes(searchTerm)) ||
  (e.speakers && e.speakers.some(s => s.toLowerCase().includes(searchTerm))) ||
  (e.location && e.location.toLowerCase().includes(searchTerm))
);
```

## Documentation Files

- `CLAUDE.md` - This file (project memory)
- `PROJECT_MEMORY.md` - Comprehensive technical documentation
- `ARCHITECTURE.md` - System architecture diagrams
- `README.md` - Project overview
- `QUICKSTART.md` - Combined setup guide + technical reference (consolidates old QUICK_REFERENCE.md)
- `IMPLEMENTATION_SUMMARY.md` - Build details

## Important Notes for Future Updates

1. **Whova Data Format:**
   - Use semicolon `;` for multiple speakers/moderators/chairs (Whova standard)
   - Date format: "YYYY-MM-DD HH:MM:SS" (parsed automatically)
   - Time format: "HH:MM:SS" (converted to HH:MM automatically)
   - HTML in descriptions is stripped automatically
   - Track names determine event type automatically
   - Export from Whova and place Excel file in `data/` folder
   - Run conversion script to generate CSV (or export directly as CSV)

2. **Multi-Track Logic:**
   - Events with same startTime/endTime + different tracks = side-by-side
   - Single event OR keynote without track = full-width plenary
   - Time display removes colon: "09:00" → "0900"

3. **Script Load Order Matters:**
   - PapaParse → CSV parser → Event renderer → Navigation
   - Each page needs `currentPageId` defined before navigation.js

4. **Responsive Design:**
   - Grid auto-fits columns on desktop
   - Stacks vertically on mobile
   - Time column shrinks: 120px → 80px → 60px

## Quick Commands

```bash
# Run server
python3 -m http.server 8000

# Verify
./verify.sh

# View pages
http://localhost:8000/index.html
http://localhost:8000/multitrack.html
http://localhost:8000/events/all.html
```

---

**End of Project Memory**
