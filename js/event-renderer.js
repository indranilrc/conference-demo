// Event Rendering Utilities

function renderEventList(events, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No events found matching the selected filters.</p>';
        return;
    }

    events.forEach((event, index) => {
        const eventCard = renderEventCard(event, index);
        container.appendChild(eventCard);
    });

    attachExpandHandlers();
}

function renderEventCard(event, index) {
    const el = document.createElement('div');
    el.className = 'agenda-item';
    el.dataset.eventId = event.id;

    const speakerInfo = renderSpeakerInfo(event);
    const moderatorInfo = renderModeratorInfo(event);
    const detailsHtml = renderEventDetails(event);

    el.innerHTML = `
        <div class="agenda-header" data-index="${index}">
            <div class="event-icon ${event.type}">${getEventIcon(event.type)}</div>
            <div class="session-info">
                <div class="event-type-badge">${event.type.toUpperCase()}</div>
                <h3>${event.title}</h3>
                <p><strong>${formatDate(event.date)}</strong></p>
                <p>${formatTime(event.startTime)} - ${formatTime(event.endTime)}</p>
                ${event.location ? `<p><span class="location-icon">📍</span> ${event.location}${event.room ? ', ' + event.room : ''}</p>` : ''}
                ${speakerInfo}
                ${moderatorInfo}
            </div>
        </div>
        <div class="agenda-details">${detailsHtml}</div>
    `;

    return el;
}

function renderSpeakerInfo(event) {
    if (!event.speakers || event.speakers.length === 0) {
        return '';
    }

    const speakerLabel = event.speakers.length === 1 ? 'Speaker' : 'Speakers';
    const speakerList = event.speakers.join(', ');

    return `<p><strong>${speakerLabel}:</strong> ${speakerList}</p>`;
}

function renderModeratorInfo(event) {
    if (!event.moderators || event.moderators.length === 0) {
        return '';
    }

    const moderatorLabel = event.moderators.length === 1 ? 'Moderator' : 'Moderators';
    const moderatorList = event.moderators.join(', ');

    return `<p><strong>${moderatorLabel}:</strong> ${moderatorList}</p>`;
}

function renderEventDetails(event) {
    let html = '';

    if (event.abstract) {
        html += `<div class="abstract"><h4>Abstract</h4><p>${event.abstract}</p></div>`;
    }

    if (event.track) {
        html += `<p><strong>Track:</strong> ${event.track}</p>`;
    }

    return html || '<p>No additional details available.</p>';
}

function getEventIcon(type) {
    const icons = {
        'panel': '👥',
        'keynote': '🎤',
        'workshop': '🔧',
        'tutorial': '📚',
        'session': '💼'
    };
    return icons[type] || '📅';
}

function attachExpandHandlers() {
    const headers = document.querySelectorAll('.agenda-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.closest('.agenda-item');
            item.classList.toggle('active');
        });
    });
}

function renderFilters(events, options = {}) {
    const { showTypeFilter = true, showDateFilter = true } = options;
    let html = '<div class="filters">';

    if (showTypeFilter) {
        const types = getUniqueTypes(events);
        html += `
            <select id="typeFilter" class="filter-select">
                <option value="all">All Types</option>
                ${types.map(type => `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`).join('')}
            </select>
        `;
    }

    if (showDateFilter) {
        const dates = getUniqueDates(events);
        html += `
            <select id="dateFilter" class="filter-select">
                <option value="">All Days</option>
                ${dates.map(date => `<option value="${date}">${formatDate(date)}</option>`).join('')}
            </select>
        `;
    }

    html += '</div>';
    return html;
}
