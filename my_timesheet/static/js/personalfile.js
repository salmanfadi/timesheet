function openEmailForm(email) {
    const emailFormModal = document.getElementById("email-form-modal");
    document.getElementById("email-to").value = email;

    emailFormModal.style.display = "block";
    setTimeout(() => {
        emailFormModal.classList.add("show");
    }, 10);
}

function closeEmailForm() {
    const emailFormModal = document.getElementById("email-form-modal");

    emailFormModal.classList.remove("show");
    setTimeout(() => {
        emailFormModal.style.display = "none";
    }, 300);
}
function openCalendar() {
    const calendarModal = document.getElementById("calendar-modal");

    calendarModal.style.display = "block";
    setTimeout(() => {
        calendarModal.classList.add("show");
    }, 10);

    updateCalendar(); 
}

function closeCalendar() {
    const calendarModal = document.getElementById("calendar-modal");

    // Hide modal with a smooth transition
    calendarModal.classList.remove("show");
    setTimeout(() => {
        calendarModal.style.display = "none";
    }, 300);
}

function updateCalendar() {
    const calendarMonth = document.getElementById("calendar-month");
    const calendarYear = document.getElementById("calendar-year");

    const month = parseInt(calendarMonth.value, 10);
    const year = parseInt(calendarYear.value, 10);

    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = ''; // Clear existing content

    const daysInMonth = new Date(year, month, 0).getDate(); // Get total days in the month
    const firstDay = new Date(year, month - 1, 1).getDay(); // Get the day of the week for the first day of the month

    // Add weekday headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(weekday => {
        const weekdayDiv = document.createElement("div");
        weekdayDiv.textContent = weekday;
        calendarGrid.appendChild(weekdayDiv);
    });

    // Add empty cells for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        calendarGrid.appendChild(emptyDiv);
    }
//picked up from kudzu DB
    const leaveDays = {
        5: "Medical Leave",
        19: "Personal Leave",
        25: "Vacation"
    };

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.textContent = day; // Display the day number

        // Highlight weekends
        const dayOfWeek = (firstDay + day - 1) % 7; // Determine the day of the week
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayDiv.style.backgroundColor = "#f0f0f0"; // Light gray for weekends
        }

        // Mark leave days
        if (leaveDays[day]) {
            dayDiv.classList.add("leave-day");
            dayDiv.title = leaveDays[day]; // Tooltip for leave reason
        }

        calendarGrid.appendChild(dayDiv);
    }
}

// Function to render employee details
function renderEmployeeDetails(employee) {
    const employeeInfoElement = document.getElementById("employee-info");
    if (employeeInfoElement) {
        employeeInfoElement.innerHTML = `
            <p><strong>Employee Code:</strong> ${employee['Employee Code']}</p>
            <p><strong>Employee Name:</strong> ${employee['Employee Name']}</p>
            <p><strong>Role:</strong> ${employee['Role']}</p>
            <p><strong>Project:</strong> ${employee['Project']}</p>
            <p><strong>Client Company:</strong> ${employee['Client Company']}</p>
            <p><strong>Timesheet Approval Status:</strong> ${employee['Timesheet Approval Status']}</p>
            <p><strong>Manager Name:</strong> ${employee['Manager Name']}</p>
            <p><strong>Total Holidays:</strong> ${employee['Total Holidays']}</p>
            <button class="view-calendar-btn" onclick="openCalendar()">View</button>
        `;
    }
}
function openCalendar() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        eventLimit: true,
        dayRender: function (date, cell) {
            if (date.day() === 0 || date.day() === 6) { // 0 = Sunday, 6 = Saturday
                cell.css("background-color", "#ffcccc"); // Light red for weekends
            }
        },
        dayClick: function(date, jsEvent, view) {
            var title = prompt('Enter event title:');
            if (title !== null) { // Check if user cancels the prompt
                var startTime = prompt('Enter event start time (HH:mm):');
                var endTime = prompt('Enter event end time (HH:mm):');
                var eventType = prompt('Enter event type (holiday, meeting):');
                if (startTime && endTime && eventType) {
                    var eventData = {
                        title: title,
                        start: date.format('YYYY-MM-DD') + 'T' + startTime,
                        end: date.format('YYYY-MM-DD') + 'T' + endTime,
                        color: eventType === 'holiday' ? 'red' : 'blue' // Red for holidays, blue for meetings
                    };
                    $('#calendar').fullCalendar('renderEvent', eventData, true); // Stick the event on the calendar
                }
            }
        },
        events: [
            // Load or initialize with predefined events if any
        ],
        eventRender: function(event, element) {
            if (event.start.day() === 0 || event.start.day() === 6) {
                element.css('background-color', '#ffcccc'); // Light red for weekends
            }
        }
    });

    // Toggle visibility of the calendar
    $('#calendar').toggle();
}
function viewTimesheet(employeeId) {
    // Redirect to the personal-tile route with the employee_id parameter
    window.location.href = `/personal-tile/${employeeId}`;
}
