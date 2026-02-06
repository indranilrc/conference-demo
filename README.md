# Conference Website

A complete, responsive conference website with CSV-based event management and dynamic filtering.

## Features

- **Homepage** with conference information, call for papers, venue details, and conference chairs
- **CSV-based Event Management** - All event data stored in `data/events.csv` for easy updates
- **Multiple Event Views**:
  - All Events (filterable by type and date)
  - Panels only
  - Keynotes only
  - Workshops & Tutorials
  - Multi-track grid view
- **Key Dates** timeline page
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Interactive Features** - Click to expand event details, filterable views

## File Structure

```
/conference-website
├── index.html                  # Homepage
├── key-dates.html              # Important dates timeline
├── multitrack.html             # Multi-track grid view
├── events/
│   ├── all.html               # All events (filterable)
│   ├── panels.html            # Panels only
│   ├── keynotes.html          # Keynotes only
│   └── workshops.html         # Workshops & tutorials
├── data/
│   ├── events.csv             # Event data (main data source)
│   └── conference-info.json   # Homepage content
├── js/
│   ├── csv-parser.js          # CSV loading utilities
│   ├── event-renderer.js      # Event rendering functions
│   └── navigation.js          # Navigation component
├── css/
│   └── style.css              # Styles for all pages
└── lib/
    └── papaparse.min.js       # CSV parsing library
```

## Getting Started

### Local Development

1. Open the website in a local web server (required for loading CSV files)

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Or using Node.js:
   ```bash
   npx http-server
   ```

2. Open your browser and navigate to `http://localhost:8000`

### Updating Content

#### Add/Edit Events

Edit `data/events.csv` with the following columns:
- `id` - Unique event ID
- `type` - Event type (panel, keynote, workshop, tutorial)
- `title` - Event title
- `abstract` - Event description
- `date` - Date (YYYY-MM-DD format)
- `startTime` - Start time (HH:MM format)
- `endTime` - End time (HH:MM format)
- `track` - Track letter for parallel sessions (A, B, etc.)
- `speakers` - Pipe-separated list (e.g., "Dr. Jane Doe|John Smith")
- `moderators` - Pipe-separated list
- `location` - Venue location
- `room` - Room number/name

#### Update Conference Information

Edit `data/conference-info.json` to update:
- Conference name
- Dates
- Location and venue
- About text
- Call for papers
- Conference chairs

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2023 International Energy Conference. All rights reserved.
