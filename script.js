const calendarBody = document.getElementById('calendar-body');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const todayBtn = document.getElementById('today-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('details-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalCloseBtn = document.getElementById('modal-close-btn');
let currentDate = new Date();

// Mock data simulating a response from the YouTube Data API
const mockUploads = [
    { id: 1, title: 'Building a Web App in 10 mins', channel: 'Code Ninja', date: 2, type: 'video' },
    { id: 2, title: 'Funny Cats Compilation', channel: 'Meme Central', date: 2, type: 'short' },
    { id: 3, title: 'Tech Review 2024', channel: 'Gadget Guru', date: 5, type: 'video' },
    { id: 4, title: 'Quick React Tip #42', channel: 'Code Ninja', date: 7, type: 'short' },
    { id: 5, title: 'Vlog: Day in the life of a dev', channel: 'Daily Vlogs', date: 14, type: 'video' },
    { id: 6, title: 'Cooking pasta in 60 seconds', channel: 'Chef Mario', date: 14, type: 'short' },
    { id: 7, title: 'Advanced CSS Animations', channel: 'Design Pro', date: 20, type: 'video' },
    { id: 8, title: 'My Studio Setup', channel: 'Gadget Guru', date: 25, type: 'video' },
    { id: 9, title: 'Poll: Next tutorial topic?', channel: 'Code Ninja', date: 22, type: 'community' }
];

// Track which media types are currently active, checking local storage first
const savedFilters = localStorage.getItem('calendarFilters');
const activeFilters = savedFilters ? JSON.parse(savedFilters) : {
    video: true,
    short: true,
    community: true
};

function openDayModal(dateString, uploads) {
    let contentHTML = `<h3>Uploads for ${dateString}</h3>`;

    if (uploads.length === 0) {
        contentHTML += `<p>No content uploaded on this day.</p>`;
    } else {
        const typeLabels = {
            'video': 'Videos',
            'short': 'Shorts',
            'community': 'Community Posts'
        };
        const typeOrder = ['video', 'short', 'community'];

        contentHTML += `<div class="modal-upload-list">`;
        
        typeOrder.forEach(type => {
            const groupUploads = uploads.filter(upload => upload.type === type);
            if (groupUploads.length > 0) {
                contentHTML += `<h4 class="category-header" data-type="${type}"><span class="toggle-icon">▼</span> ${typeLabels[type]}</h4>`;
                contentHTML += `<div class="category-content" id="content-${type}">`;
                groupUploads.forEach(upload => {
                    contentHTML += `
                        <div class="modal-upload-item ${upload.type}">
                            <div style="margin-bottom: 5px;"><strong>${upload.channel}</strong>: ${upload.title}</div>
                        </div>
                    `;
                });
                contentHTML += `</div>`;
            }
        });
        contentHTML += `</div>`;
    }

    modalContent.innerHTML = contentHTML;
    document.body.classList.add('modal-open');

    // Add event listeners for collapsible category headers
    const headers = modalContent.querySelectorAll('.category-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const type = header.getAttribute('data-type');
            const content = modalContent.querySelector(`#content-${type}`);
            const icon = header.querySelector('.toggle-icon');
            
            content.classList.toggle('collapsed');
            icon.innerText = content.classList.contains('collapsed') ? '▶' : '▼';
        });
    });
}

function closeModal() {
    document.body.classList.remove('modal-open');
}

function renderCalendar(date) {
    // Clear the calendar body before rendering the new month
    calendarBody.innerHTML = '';
    
    const searchQuery = searchInput.value.toLowerCase();

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 = January, 11 = December)

    // Update the UI to display the current month and year
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('month-year').innerText = `${monthNames[month]} ${year}`;

    // Get today's actual date to highlight the current day
    const actualToday = new Date();
    const isViewingCurrentMonth = actualToday.getFullYear() === year && actualToday.getMonth() === month;

    // Calculate the number of days in the current month (Passing 0 as the day gets the last day of the previous month)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calculate the day of the week the 1st of the month falls on (0 = Sun, 1 = Mon, etc.)
    const startDayOfWeek = new Date(year, month, 1).getDay();

    // 1. Create empty slots for days belonging to the previous month
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        calendarBody.appendChild(emptyCell);
    }

    // 2. Generate the actual days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        
        const dayLabel = document.createElement('div');
        dayLabel.classList.add('day-number');
        dayLabel.innerText = i;
        dayCell.appendChild(dayLabel);

        // Highlight if this specific day cell is today
        if (isViewingCurrentMonth && i === actualToday.getDate()) {
            dayCell.classList.add('current-day');
        }

        // Filter the mock data to find uploads for this specific day, active media types, and search query
        const dayUploads = mockUploads.filter(upload => {
            const matchesDateAndType = upload.date === i && activeFilters[upload.type];
            const matchesSearch = upload.title.toLowerCase().includes(searchQuery) || upload.channel.toLowerCase().includes(searchQuery);
            return matchesDateAndType && matchesSearch;
        });
        
        // Make the entire day cell clickable to open the day view modal
        dayCell.addEventListener('click', () => {
            const dateString = `${monthNames[month]} ${i}, ${year}`;
            openDayModal(dateString, dayUploads);
        });

        // Limit the number of visually rendered items to prevent layout issues
        const MAX_ITEMS = 3;
        const uploadsToShow = dayUploads.slice(0, MAX_ITEMS);
        
        uploadsToShow.forEach(upload => {
            const videoItem = document.createElement('div');
            videoItem.classList.add('yt-item', upload.type);
            videoItem.innerText = `${upload.channel}: ${upload.title}`;
            dayCell.appendChild(videoItem);
        });

        // Add a '+X more' indicator if there are more uploads than the limit
        if (dayUploads.length > MAX_ITEMS) {
            const moreIndicator = document.createElement('div');
            moreIndicator.classList.add('more-indicator');
            moreIndicator.innerText = `+${dayUploads.length - MAX_ITEMS} more`;
            dayCell.appendChild(moreIndicator);
        }

        calendarBody.appendChild(dayCell);
    }

    // 3. Create empty slots at the end to complete the final week's row
    const totalCells = startDayOfWeek + daysInMonth;
    const emptyCellsAtEnd = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < emptyCellsAtEnd; i++) {
        const emptyCell = document.createElement('div');
        calendarBody.appendChild(emptyCell);
    }
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar(currentDate);
});

// Check local storage for dark mode preference on load
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Modal event listeners
modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
window.addEventListener('keydown', (e) => {
    // Close modal on 'Escape' key press
    if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
        closeModal();
    }
});

// Setup click listeners and initial visual state for media type filtering
document.querySelectorAll('.legend-item').forEach(item => {
    const type = item.getAttribute('data-type');
    
    // Set initial visual state based on loaded filters
    if (type && !activeFilters[type]) {
        item.classList.add('inactive');
    }

    item.addEventListener('click', () => {
        if (type) {
            activeFilters[type] = !activeFilters[type];
            item.classList.toggle('inactive');
            localStorage.setItem('calendarFilters', JSON.stringify(activeFilters));
            renderCalendar(currentDate);
        }
    });
});

// Re-render calendar when user types in the search bar
searchInput.addEventListener('input', () => {
    renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);