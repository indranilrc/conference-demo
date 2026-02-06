# System Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Navigates to page
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       HTML PAGE LOADS                        │
│  (index.html, events/*.html, multitrack.html, etc.)         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Includes scripts
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    JAVASCRIPT MODULES                        │
│                                                              │
│  1. PapaParse (lib/papaparse.min.js)                        │
│  2. CSV Parser (js/csv-parser.js)                           │
│  3. Event Renderer (js/event-renderer.js)                   │
│  4. Navigation (js/navigation.js)                           │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ↓                   ↓
         ┌──────────────────┐  ┌──────────────────┐
         │   FETCH REQUEST  │  │   FETCH REQUEST  │
         │                  │  │                  │
         │  events.csv      │  │  conference-     │
         │  (via PapaParse) │  │  info.json       │
         └──────────────────┘  └──────────────────┘
                    │                   │
                    ↓                   ↓
         ┌──────────────────┐  ┌──────────────────┐
         │   PARSE & LOAD   │  │   PARSE & LOAD   │
         │                  │  │                  │
         │  CSV → Objects   │  │  JSON → Object   │
         └──────────────────┘  └──────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ↓
         ┌────────────────────────────────────────┐
         │         DATA PROCESSING                │
         │                                        │
         │  - Filter by type/date/track          │
         │  - Group by day/time                  │
         │  - Sort chronologically               │
         │  - Detect plenary sessions            │
         └────────────────────────────────────────┘
                              │
                              ↓
         ┌────────────────────────────────────────┐
         │         RENDER TO DOM                  │
         │                                        │
         │  - Create session cards               │
         │  - Build schedule grid                │
         │  - Apply styling                      │
         │  - Attach event handlers              │
         └────────────────────────────────────────┘
                              │
                              ↓
         ┌────────────────────────────────────────┐
         │       USER INTERACTION                 │
         │                                        │
         │  - Click day tabs                     │
         │  - Use filters                        │
         │  - Expand session details             │
         │  - Navigate between pages             │
         └────────────────────────────────────────┘
```

## Component Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │
│  │   Homepage  │  │ Event Pages │  │  Multi-Track View    │ │
│  │             │  │             │  │                      │ │
│  │ - Hero      │  │ - All       │  │ - Day tabs          │ │
│  │ - About     │  │ - Panels    │  │ - Time grid         │ │
│  │ - Chairs    │  │ - Keynotes  │  │ - Session cards     │ │
│  │ - Venue     │  │ - Workshops │  │ - Parallel display  │ │
│  └─────────────┘  └─────────────┘  └──────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                          LOGIC LAYER                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │  CSV Parser      │  │ Event Renderer │  │  Navigation  │ │
│  │                  │  │                │  │              │ │
│  │ - loadEvents()   │  │ - renderList() │  │ - render()   │ │
│  │ - filter()       │  │ - renderCard() │  │ - highlight  │ │
│  │ - group()        │  │ - speakers()   │  │ - dropdown   │ │
│  │ - format()       │  │ - moderators() │  │              │ │
│  └──────────────────┘  └────────────────┘  └──────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────────┐
│                          DATA LAYER                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐         ┌──────────────────────┐  │
│  │   events.csv         │         │  conference-info.json│  │
│  │                      │         │                      │  │
│  │ - 15 events          │         │ - Conference details │  │
│  │ - Multiple types     │         │ - Chairs info        │  │
│  │ - 3 days             │         │ - Venue data         │  │
│  │ - Parallel tracks    │         │                      │  │
│  └──────────────────────┘         └──────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Multi-Track Schedule Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   MULTI-TRACK VIEW                       │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │  Day 1  │      │  Day 2  │      │  Day 3  │
   │   Tab   │      │   Tab   │      │   Tab   │
   └─────────┘      └─────────┘      └─────────┘
        │                 │                 │
        └─────────────────┴─────────────────┘
                          │
                          ↓
        ┌─────────────────────────────────────────┐
        │      GROUP EVENTS BY TIME SLOTS         │
        │                                         │
        │  09:00-10:00 → [Event1, Event2, ...]   │
        │  10:30-11:30 → [Event3]                │
        │  13:00-15:00 → [Event4, Event5]        │
        └─────────────────────────────────────────┘
                          │
                          ↓
        ┌─────────────────────────────────────────┐
        │         FOR EACH TIME SLOT:             │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │  TIME CELL (120px blue column)   │  │
        │  │                                  │  │
        │  │  Shows: HHMM (e.g., "0900")     │  │
        │  └──────────────────────────────────┘  │
        │                                         │
        │  ┌──────────────────────────────────┐  │
        │  │  SESSIONS CELL (flexible width)  │  │
        │  │                                  │  │
        │  │  ┌────────────────────────────┐ │  │
        │  │  │   SESSIONS GRID            │ │  │
        │  │  │                            │ │  │
        │  │  │   Auto-fit columns:        │ │  │
        │  │  │   - 1 event = full width   │ │  │
        │  │  │   - 2+ events = side-by-side│ │  │
        │  │  │                            │ │  │
        │  │  │   ┌──────┐  ┌──────┐       │ │  │
        │  │  │   │Card A│  │Card B│       │ │  │
        │  │  │   └──────┘  └──────┘       │ │  │
        │  │  └────────────────────────────┘ │  │
        │  └──────────────────────────────────┘  │
        └─────────────────────────────────────────┘
```

## Session Card Decision Tree

```
                    Load Event Data
                          │
                          ↓
              ┌───────────────────────┐
              │  Count events in      │
              │  this time slot       │
              └───────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ↓                               ↓
      [1 Event]                      [2+ Events]
          │                               │
          ↓                               ↓
    ┌──────────┐                    ┌──────────┐
    │ Keynote? │                    │ Compare  │
    │    OR    │                    │  Tracks  │
    │ No Track?│                    └──────────┘
    └──────────┘                          │
          │                    ┌──────────┴──────────┐
    ┌─────┴─────┐              ↓                     ↓
    ↓           ↓         [Same Track]        [Different Tracks]
  [YES]       [NO]             │                     │
    │           │              ↓                     ↓
    ↓           ↓         ┌─────────┐          ┌──────────┐
┌────────┐  ┌────────┐   │ Single  │          │ Multiple │
│PLENARY │  │REGULAR │   │ Column  │          │ Columns  │
│        │  │        │   └─────────┘          └──────────┘
│Full    │  │Normal  │        │                     │
│Width   │  │Card    │        ↓                     ↓
└────────┘  └────────┘   One session          Side-by-side
                         takes full            parallel
                         row width             sessions
```

## Filtering Architecture

```
┌────────────────────────────────────────────────────────┐
│                   RAW EVENT DATA                        │
│               (Loaded from events.csv)                  │
└────────────────────────────────────────────────────────┘
                          │
                          ↓
┌────────────────────────────────────────────────────────┐
│              FILTER PIPELINE (events/*.html)            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  1. Pre-filter (if specific page)                │ │
│  │     - panels.html   → type = 'panel'             │ │
│  │     - keynotes.html → type = 'keynote'           │ │
│  │     - workshops.html→ type in ['workshop',       │ │
│  │                                 'tutorial']       │ │
│  └──────────────────────────────────────────────────┘ │
│                          │                             │
│                          ↓                             │
│  ┌──────────────────────────────────────────────────┐ │
│  │  2. User-selected filters                        │ │
│  │     - Type dropdown (all.html only)              │ │
│  │     - Date dropdown (all pages)                  │ │
│  └──────────────────────────────────────────────────┘ │
│                          │                             │
└──────────────────────────┼─────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│                 FILTERED EVENT LIST                     │
└────────────────────────────────────────────────────────┘
                          │
                          ↓
┌────────────────────────────────────────────────────────┐
│                 RENDER TO DISPLAY                       │
└────────────────────────────────────────────────────────┘
```

## Responsive Design Breakpoints

```
Desktop (>768px)              Tablet (768px)            Mobile (480px)
┌──────────────────┐         ┌─────────────┐          ┌─────────┐
│  Time  │ Sessions│         │Time│Sessions│          │Time│Sess│
│  120px │  1fr    │         │80px│  1fr   │          │60px│1fr │
│        │         │         │    │        │          │    │    │
│  0900  │ ┌────┐ │         │0900│ ┌────┐ │          │0900│┌──┐│
│        │ │ A  │ │         │    │ │ A  │ │          │    ││A ││
│        │ └────┘ │         │    │ └────┘ │          │    │└──┘│
│        │ ┌────┐ │         │    │ ┌────┐ │          │    │┌──┐│
│        │ │ B  │ │         │    │ │ B  │ │          │    ││B ││
│        │ └────┘ │         │    │ └────┘ │          │    │└──┘│
│        │         │         │    │        │          │    │    │
│  1030  │ ┌──────┐         │1030│ ┌────┐ │          │1030│┌──┐│
│        │ │Plenary│        │    │ │Full│ │          │    ││F ││
│        │ └──────┘         │    │ └────┘ │          │    │└──┘│
└──────────────────┘         └─────────────┘          └─────────┘

Grid: auto-fit               Grid: 1 column           Grid: 1 column
Side-by-side tracks          Stacked vertically       Stacked vertically
```

## Page Navigation Flow

```
              ┌──────────────┐
              │  index.html  │
              │   Homepage   │
              └──────────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │Key Dates │ │  Events  │ │Multitrack│
  └──────────┘ └──────────┘ └──────────┘
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
  ┌────────┐  ┌─────────┐  ┌────────┐
  │  All   │  │ Panels  │  │Keynotes│
  └────────┘  └─────────┘  └────────┘
                               ↓
                         ┌──────────┐
                         │Workshops │
                         └──────────┘

  Navigation Component (js/navigation.js)
  renders consistently on all pages
```

## Technology Stack

```
┌──────────────────────────────────────────┐
│            PRESENTATION                   │
│  • HTML5                                  │
│  • CSS3 (Grid, Flexbox)                   │
│  • Responsive Design                      │
└──────────────────────────────────────────┘
                    │
┌──────────────────────────────────────────┐
│            SCRIPTING                      │
│  • Vanilla JavaScript (ES6+)              │
│  • No frameworks                          │
│  • Modular architecture                   │
└──────────────────────────────────────────┘
                    │
┌──────────────────────────────────────────┐
│            LIBRARIES                      │
│  • PapaParse 5.4.1 (CSV parsing)          │
└──────────────────────────────────────────┘
                    │
┌──────────────────────────────────────────┐
│            DATA                           │
│  • CSV (events)                           │
│  • JSON (configuration)                   │
└──────────────────────────────────────────┘
                    │
┌──────────────────────────────────────────┐
│            SERVER                         │
│  • Static file hosting                    │
│  • No backend required                    │
│  • Local dev: Python/Node/PHP             │
└──────────────────────────────────────────┘
```

---

**Architecture Version:** 1.0
**Last Updated:** February 4, 2026
