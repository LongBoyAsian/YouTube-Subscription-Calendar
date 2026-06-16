const calendarBody = document.getElementById('calendar-body');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');
const todayBtn = document.getElementById('today-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
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
    { id: 8, title: 'My Studio Setup', channel: 'Gadget Guru', date: 25, type: 'video' }
];

function renderCalendar(date) {
    // Clear the calendar body before rendering the new month
    calendarBody.innerHTML = '';

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

        // Filter the mock data to find uploads for this specific day
        const dayUploads = mockUploads.filter(upload => upload.date === i);
        
        dayUploads.forEach(upload => {
            const videoLink = document.createElement('a');
            videoLink.href = '#'; 
            videoLink.classList.add('yt-item', upload.type); // Applies the red or purple color
            videoLink.title = `${upload.type === 'short' ? 'Short' : 'Video'}: ${upload.title}`;
            videoLink.innerText = `${upload.channel}: ${upload.title}`;
            dayCell.appendChild(videoLink);
        });

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

// Initial render
renderCalendar(currentDate);