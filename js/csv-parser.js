// CSV Parser and Event Utilities

// Helper function to strip HTML tags from text
function stripHTML(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

// Helper function to extract date from datetime string
function extractDate(datetimeStr) {
    if (!datetimeStr) return '';
    // Format: "2025-10-25 00:00:00" -> "2025-10-25"
    return datetimeStr.split(' ')[0];
}

// Helper function to format time from HH:MM:SS to HH:MM
function formatTimeStr(timeStr) {
    if (!timeStr) return '';
    // Format: "08:00:00" -> "08:00"
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
}

// Helper function to determine event type from track
function determineEventType(track, sessionType) {
    if (!track) return 'session';
    const trackLower = track.toLowerCase();

    // Check for specific event types in track name
    if (trackLower.includes('keynote')) return 'keynote';
    if (trackLower.includes('panel')) return 'panel';
    if (trackLower.includes('workshop')) return 'workshop';
    if (trackLower.includes('tutorial')) return 'tutorial';
    if (trackLower.includes('short course')) return 'tutorial';
    if (trackLower.includes('doctoral')) return 'session';
    if (trackLower.includes('technical paper')) return 'session';
    if (trackLower.includes('product showcase')) return 'session';
    if (trackLower.includes('tech demo')) return 'session';

    // Default to session
    return 'session';
}

async function loadEvents(csvPath) {
    return new Promise((resolve, reject) => {
        Papa.parse(csvPath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                // Transform Whova CSV data to match expected format
                const events = results.data
                    .filter(row => row['*Date'] && row['*Session Title']) // Filter out rows without required fields
                    .map((row, index) => ({
                        id: index + 1,
                        type: determineEventType(row['Tracks (Optional)'], row['Session or Sub-session(Sub) (Optional)']),
                        title: row['*Session Title'] || '',
                        abstract: stripHTML(row['Description (Optional)'] || ''),
                        date: extractDate(row['*Date']),
                        startTime: formatTimeStr(row['*Time Start']),
                        endTime: formatTimeStr(row['*Time End']),
                        track: row['Tracks (Optional)'] || '',
                        speakers: row['Speakers (Optional)'] ? row['Speakers (Optional)'].split(';').map(s => s.trim()).filter(s => s) : [],
                        moderators: row['Role: Moderators (Optional)'] ? row['Role: Moderators (Optional)'].split(';').map(m => m.trim()).filter(m => m) : [],
                        sessionChairs: row['Role: Session Chairs (Optional)'] ? row['Role: Session Chairs (Optional)'].split(';').map(c => c.trim()).filter(c => c) : [],
                        location: '',
                        room: row['Room/Location (Optional)'] || '',
                        sessionType: row['Session or Sub-session(Sub) (Optional)'] || 'Session',
                        tags: row['Tags (Optional)'] ? row['Tags (Optional)'].split(';').map(t => t.trim()).filter(t => t) : [],
                        authors: row['Authors (Optional)'] ? row['Authors (Optional)'].split(';').map(a => a.trim()).filter(a => a) : []
                    }));
                resolve(events);
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

function filterEvents(events, filters) {
    return events.filter(event => {
        // Filter by type
        if (filters.type && filters.type !== 'all' && event.type !== filters.type) {
            return false;
        }

        // Filter by date
        if (filters.date && event.date !== filters.date) {
            return false;
        }

        // Filter by track
        if (filters.track && event.track !== filters.track) {
            return false;
        }

        return true;
    });
}

function groupByDayAndTime(events) {
    const grouped = {};

    events.forEach(event => {
        const dateObj = new Date(event.date);
        const day = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        if (!grouped[day]) {
            grouped[day] = {};
        }

        const timeKey = `${event.startTime}-${event.endTime}`;
        if (!grouped[day][timeKey]) {
            grouped[day][timeKey] = [];
        }

        grouped[day][timeKey].push(event);
    });

    return grouped;
}

function getUniqueDates(events) {
    const dates = [...new Set(events.map(e => e.date))];
    return dates.sort();
}

function getUniqueTypes(events) {
    return [...new Set(events.map(e => e.type))];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}
