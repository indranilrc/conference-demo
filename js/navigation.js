// Navigation Component

function renderNavigation(currentPage) {
    const navItems = [
        { id: 'home', label: 'Home', url: '/index.html' },
        { id: 'dates', label: 'Key Dates', url: '/key-dates.html' },
        { id: 'events-all', label: 'All Events', url: '/events/all.html' },
        { id: 'events-panels', label: 'Panels', url: '/events/panels.html' },
        { id: 'events-keynotes', label: 'Keynotes', url: '/events/keynotes.html' },
        { id: 'events-workshops', label: 'Workshops', url: '/events/workshops.html' },
        { id: 'multitrack', label: 'Multi-Track View', url: '/multitrack.html' }
    ];

    let html = '<nav class="main-nav"><div class="nav-container"><ul class="nav-menu">';

    navItems.forEach(item => {
        const isActive = currentPage === item.id ? 'active' : '';
        html += `<li class="nav-item ${isActive}"><a href="${item.url}" class="nav-link">${item.label}</a></li>`;
    });

    html += '</ul></div></nav>';
    return html;
}

// Insert navigation after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    const navPlaceholder = document.getElementById('main-nav');
    if (navPlaceholder && typeof currentPageId !== 'undefined') {
        navPlaceholder.innerHTML = renderNavigation(currentPageId);
    }
});
