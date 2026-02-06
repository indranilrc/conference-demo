# Quick Start Guide

## Running the Website Locally

The website requires a local web server to load CSV files. Choose one of these methods:

### Option 1: Python (Recommended)

```bash
cd /Users/iroychoudhury/Documents/Personal/conference-website
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Option 2: Node.js

```bash
npx http-server
```

### Option 3: PHP

```bash
php -S localhost:8000
```

## Testing the Implementation

Once the server is running, test these pages:

1. **Homepage** (http://localhost:8000/index.html)
   - ✓ Conference info loads from JSON
   - ✓ Navigation menu appears
   - ✓ All sections display

2. **All Events** (http://localhost:8000/events/all.html)
   - ✓ Events load from CSV
   - ✓ Type filter works
   - ✓ Date filter works
   - ✓ Click to expand details

3. **Panels** (http://localhost:8000/events/panels.html)
   - ✓ Shows only panel events
   - ✓ Date filter works

4. **Keynotes** (http://localhost:8000/events/keynotes.html)
   - ✓ Shows only keynote events

5. **Workshops** (http://localhost:8000/events/workshops.html)
   - ✓ Shows workshops and tutorials

6. **Multi-Track** (http://localhost:8000/multitrack.html)
   - ✓ Events grouped by day and time
   - ✓ Parallel sessions display side-by-side
   - ✓ Day filter buttons work

7. **Key Dates** (http://localhost:8000/key-dates.html)
   - ✓ Timeline displays

## Verification

```bash
./verify.sh  # Check all files + validate data
```

---

## Technical Reference

### File Structure

```text
conference-website/
├── index.html                 # Homepage
├── key-dates.html             # Timeline
├── multitrack.html            # Schedule grid (NEW DESIGN)
├── events/
│   ├── all.html              # All events + filters
│   ├── panels.html           # Panels only
│   ├── keynotes.html         # Keynotes only
│   └── workshops.html        # Workshops + tutorials
├── data/
│   ├── events.csv            # ⭐ MAIN DATA SOURCE
│   └── conference-info.json  # Homepage content
└── js/
    ├── csv-parser.js         # Data loading
    ├── event-renderer.js     # Event cards
    └── navigation.js         # Nav menu
```

### Data Format

#### whova_agenda.csv (Whova Export Format)

The website uses Whova agenda exports. Key columns:

- `*Date`: DateTime (2025-10-25 00:00:00)
- `*Time Start / *Time End`: Time (08:00:00)
- `Tracks (Optional)`: Track name (auto-detects event type)
- `*Session Title`: Event title
- `Room/Location (Optional)`: Room name
- `Description (Optional)`: HTML description (auto-stripped)
- `Speakers (Optional)`: Semicolon-separated (Speaker 1; Speaker 2)
- `Role: Moderators (Optional)`: Moderators
- `Role: Session Chairs (Optional)`: Session chairs
- `Tags (Optional)`: Event tags

**Event Types:** keynote, panel, workshop, tutorial, session (auto-detected from track names)

**Data Processing:**
- HTML is automatically stripped
- Semicolon-separated lists become arrays
- DateTime/Time formats are converted automatically

#### conference-info.json

Edit this file to update:

- Conference name and dates
- Venue information
- About text
- Call for papers
- Conference chairs

```json
{
  "name": "My Conference 2024",
  "dates": "March 15-17, 2024",
  ...
}
```

### Common Operations

#### Add New Event

1. Export updated agenda from Whova as Excel
2. Convert to CSV:
   ```bash
   python3 -c "import pandas as pd; pd.read_excel('data/Whova_agenda_import_2025.xlsx', skiprows=31, header=0).dropna(how='all').to_csv('data/whova_agenda.csv', index=False)"
   ```
3. Refresh the browser - changes appear immediately!

Or manually edit `data/whova_agenda.csv` following the Whova format

#### Create Parallel Sessions

Same time + different tracks:

```csv
17,panel,Session A,Desc,2023-10-01,14:00,15:30,A,...
18,panel,Session B,Desc,2023-10-01,14:00,15:30,B,...
```

→ Display side-by-side

#### Create Plenary Session

Leave track empty:

```csv
19,keynote,Big Talk,Desc,2023-10-01,09:00,10:00,,...
```

→ Full-width display

### Multi-Track Schedule Design

**Current Features:**

- ✅ Day tabs at top
- ✅ Time column (blue, shows HHMM format)
- ✅ Session grid layout
- ✅ Colored type badges
- ✅ Parallel tracks side-by-side
- ✅ Plenary sessions full-width
- ✅ Responsive mobile layout

**Colors:**

- Navy (#1e4d8b): Time cells, panel badges
- Purple (#5c6bc0): Keynote badges
- Teal (#26a69a): Workshop badges
- Magenta (#ab47bc): Tutorial badges
- Gray (#d9d9d9): Session cards

### Pages

- `/` or `/index.html` - Homepage
- `/key-dates.html` - Important dates
- `/events/all.html` - All events
- `/events/panels.html` - Panels
- `/events/keynotes.html` - Keynotes
- `/events/workshops.html` - Workshops
- `/multitrack.html` - Schedule grid ⭐

### CSS Classes

**Layout:**

- `.agenda-container` - Main container (max 1000px)
- `.schedule-grid` - Multi-track grid wrapper
- `.time-row` - Grid row (120px time + sessions)
- `.day-tabs` - Day navigation tabs

**Components:**

- `.session-card` - Event card
- `.session-card.plenary` - Full-width
- `.session-type-badge` - Colored badge
- `.day-tab.active` - Active day tab

### JavaScript Functions

**CSV Parser:**

- `loadEvents(path)` - Load CSV
- `filterEvents(events, {type, date, track})` - Filter
- `formatDate(str)` - Format date display
- `formatTime(str)` - Format time display

**Renderer:**

- `renderEventList(events, containerId)` - Render list
- `renderEventCard(event, index)` - Create card

### Troubleshooting

#### Events not loading?

- Check browser console for errors (F12)
- Ensure you're using a web server (not file://)
- Verify CSV file exists at `data/events.csv`

#### Parallel sessions not side-by-side?

- Check same startTime and endTime
- Verify different track letters (A, B, C...)

#### Plenary not full-width?

- Ensure track field is empty in CSV

#### Navigation not working?

- Check that `currentPageId` is defined before loading navigation.js
- Verify navigation.js is loaded

#### Filters not working?

- Check browser console for JavaScript errors
- Verify all required JS files are loaded in correct order:
  1. papaparse.min.js
  2. csv-parser.js
  3. event-renderer.js
  4. navigation.js

### Modification Tips

1. **Always edit CSV** - It's the source of truth
2. **Use correct date format** - YYYY-MM-DD
3. **24-hour time** - 09:00, 13:30, 16:00
4. **Track for parallels** - Same time + different track
5. **Pipe separator** - For multiple speakers

### Current Schedule (15 Events)

**Day 1** (Oct 1): 4 events

**Day 2** (Oct 2): 7 events (3 parallel pairs!)

**Day 3** (Oct 3): 4 events (1 parallel pair)

### Documentation

- `PROJECT_MEMORY.md` - Complete system documentation
- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - Build details

---

**Last Updated:** Feb 4, 2026