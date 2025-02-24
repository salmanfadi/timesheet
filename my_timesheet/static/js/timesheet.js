document.addEventListener("DOMContentLoaded", () => {
    const monthInput = document.getElementById("month_year");
    const localDateTimeSpan = document.getElementById("local-date-time");

    // Get current year, month, and exact local date/time
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Pad with zero if needed
    const localTime = currentDate.toLocaleString(); // Get local date and time

    // Set the month input to the current month and disable it
    monthInput.value = `${currentYear}-${currentMonth}`;
  

    // Display the local date and time
    localDateTimeSpan.textContent = localTime;

    // Generate the timesheet for the current month
    generateTimesheet();
});

function generateTimesheet() {
    const timesheetBody = document.getElementById("timesheet-body");

    // Clear any existing rows
    timesheetBody.innerHTML = "";

    const monthInput = document.getElementById("month_year");
    const [year, month] = monthInput.value.split("-");
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDay = new Date(year, month - 1, i);
        const dayOfWeek = daysOfWeek[currentDay.getDay()];

        const row = document.createElement("tr");

        if (dayOfWeek === "Saturday" || dayOfWeek === "Sunday") {
            row.innerHTML = `
                <td>${i}</td>
                <td>${dayOfWeek}</td>
                <td><input type="time" name="login-time-${i}" class="log-in-time" disabled></td>
                <td><input type="time" name="logout-time-${i}" class="log-out-time" disabled></td>
                <td class="work-hours">N/A</td>
                <td><input type="text" name="shift-details-${i}" disabled></td>
                <td><input type="text" name="remarks-${i}" disabled></td>
                <td><input type="checkbox" name="leave-${i}" checked disabled></td> <!-- Leave option checked and disabled for weekends -->
                <td>
                    <input type="checkbox" name="workday-${i}" onchange="toggleWorkday(${i})">
                </td>
                
            `;
        } else {
            row.innerHTML = `
                <td>${i}</td>
                <td>${dayOfWeek}</td>
                <td><input type="time" name="login-time-${i}" class="log-in-time" required></td>
                <td><input type="time" name="logout-time-${i}" class="log-out-time" required></td>
                <td class="work-hours">N/A</td>
                <td><input type="text" name="shift-details-${i}"></td>
                <td><input type="text" name="remarks-${i}"></td>
                <td>
                    <input type="checkbox" name="leave-${i}" onchange="toggleLeave(${i})">
                </td>
                <td><input type="checkbox" name="workday-${i}" checked onchange="toggleWorkday(${i})"></td>
            `;
        }

        timesheetBody.appendChild(row);
    }
}

function toggleWorkday(day) {
    const workdayCheckbox = document.querySelector(`input[name="workday-${day}"]`);
    const leaveCheckbox = document.querySelector(`input[name="leave-${day}"]`);
    const loginTimeInput = document.querySelector(`input[name="login-time-${day}"]`);
    const logoutTimeInput = document.querySelector(`input[name="logout-time-${day}"]`);
    const shiftDetailsInput = document.querySelector(`input[name="shift-details-${day}"]`);
    const remarksInput = document.querySelector(`input[name="remarks-${day}"]`);

    if (workdayCheckbox.checked) {
        leaveCheckbox.checked = false; // Uncheck leave if workday is checked
    }

    const isEnabled = workdayCheckbox.checked;

    loginTimeInput.disabled = !isEnabled;
    logoutTimeInput.disabled = !isEnabled;
    shiftDetailsInput.disabled = !isEnabled;
    remarksInput.disabled = !isEnabled;
}

function toggleLeave(day) {
    const leaveCheckbox = document.querySelector(`input[name="leave-${day}"]`);
    const workdayCheckbox = document.querySelector(`input[name="workday-${day}"]`);
    const loginTimeInput = document.querySelector(`input[name="login-time-${day}"]`);
    const logoutTimeInput = document.querySelector(`input[name="logout-time-${day}"]`);
    const shiftDetailsInput = document.querySelector(`input[name="shift-details-${day}"]`);
    const remarksInput = document.querySelector(`input[name="remarks-${day}"]`);

    if (leaveCheckbox.checked) {
        workdayCheckbox.checked = false; // Uncheck workday if leave is checked
    }

    const isLeave = leaveCheckbox.checked;

    loginTimeInput.disabled = isLeave;
    logoutTimeInput.disabled = isLeave;
    shiftDetailsInput.disabled = isLeave;
    remarksInput.disabled = isLeave;

    // Clear values if "Leave" is checked
    if (isLeave) {
        loginTimeInput.value = "";
        logoutTimeInput.value = "";
        shiftDetailsInput.value = "";
        remarksInput.value = "";
    }
}

function calculateWorkHours(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);

    if (end < start) {
        return "Invalid";
    }

    const diffMs = end - start;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours: diffHrs, minutes: diffMins, text: `${diffHrs}h ${diffMins}m` };
}

function updateWorkHours() {
    const tableBody = document.getElementById('timesheet-body');
    const rows = tableBody.getElementsByTagName('tr');
    let totalHours = 0;
    let totalMinutes = 0;

    for (let row of rows) {
        const logInTime = row.querySelector('.log-in-time').value;
        const logOutTime = row.querySelector('.log-out-time').value;
        const workHoursCell = row.querySelector('.work-hours');

        if (logInTime && logOutTime) {
            validateLogoutTime(row.rowIndex); // Validate logout time for the current row
            const workHours = calculateWorkHours(logInTime, logOutTime);
            workHoursCell.textContent = workHours.text;

            totalHours += workHours.hours;
            totalMinutes += workHours.minutes;
        } else {
            workHoursCell.textContent = 'N/A';
        }
    }

    // Convert total minutes into hours and minutes
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    // Update the total work hours in the footer
    document.getElementById('total-work-hours').textContent = `${totalHours}h ${totalMinutes}m`;
}

// Function to validate logout time
function validateLogoutTime(day) {
    const loginTimeInput = document.querySelector(`input[name="login-time-${day}"]`);
    const logoutTimeInput = document.querySelector(`input[name="logout-time-${day}"]`);

    const loginTime = loginTimeInput.value;
    const logoutTime = logoutTimeInput.value;

    if (loginTime && logoutTime && logoutTime < loginTime) {
        alert("Logout time cannot be earlier than login time.");
        logoutTimeInput.value = ""; // Clear the logout time
    }
}

// Call this function when the log-in or log-out time changes
document.addEventListener('input', function(event) {
    if (event.target.classList.contains('log-in-time') || event.target.classList.contains('log-out-time')) {
        updateWorkHours();
    }
});

function downloadTimesheet() {
    const ws = XLSX.utils.table_to_sheet(document.querySelector("table"));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "timesheet.xlsx");
}

