function sendBulkEmail() {
    const selectedTiles = document.querySelectorAll(".tile-view-horizontal .select-tile:checked");
    const selectedRows = document.querySelectorAll("#employee-table .select-row:checked");
    const emailList = new Set();

    // Process selected tiles
    selectedTiles.forEach(tile => {
        const emailParagraph = tile.closest(".employee-tile").querySelector("p:nth-child(5)");
        if (emailParagraph) {
            const email = emailParagraph.textContent.trim();
            emailList.add(email);
        }
    });
    
    // Process selected rows
    selectedRows.forEach(row => {
        const emailCell = row.closest("tr").querySelector("td:nth-child(4)");
        if (emailCell) {
            const email = emailCell.textContent.trim();
            emailList.add(email);
        }
    });

    // Construct the mailto: URL
    const toEmails = Array.from(emailList).join(",");
    const mailtoLink = `mailto:${toEmails}`;

    // Open the default email application
    window.location.href = mailtoLink;
}

function toggleView() {
    var tileView = document.getElementById('tile-view');
    var tableView = document.getElementById('table-view');
    var toggleButton = document.getElementById('toggle-view');

    if (tileView.style.display === 'none') {
        // Switch to tile view
        tileView.style.display = 'flex';
        tableView.style.display = 'none';
        toggleButton.textContent = '🌐'; // Icon for grid view
    } else {
        // Switch to table view
        tileView.style.display = 'none';
        tableView.style.display = 'block';
        toggleButton.textContent = '🔲'; // Icon for tile view
    }
}

// Additional functions and styles go here



function selectAllTiles() {
    var tiles = document.getElementsByClassName('select-tile');
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].checked = true;
    }
}
function selectAllRows() {
    // Check if all rows are currently selected
    var allRowsSelected = true;
    var tableCheckboxes = document.querySelectorAll('#employee-table tbody input[type="checkbox"]');
    tableCheckboxes.forEach(function(checkbox) {
        if (!checkbox.checked) {
            allRowsSelected = false;
        }
    });

    // Toggle selection state based on current state
    tableCheckboxes.forEach(function(checkbox) {
        checkbox.checked = !allRowsSelected;
    });
}


function generateListView() {
    const employeeTiles = document.querySelectorAll(".employee-tile");

    employeeTiles.forEach((tile) => {
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");

        // Copy relevant information from tile to list item
        const employeeId = tile.querySelector("p:nth-child(1)").innerText;
        const employeeName = tile.querySelector("p:nth-child(2)").innerText;
        const projectName = tile.querySelector("p:nth-child(3)").innerText;
        const employeeStatus = tile.querySelector("p:nth-child(4)").innerText;

        listItem.innerHTML = `
            <p><strong>${employeeId}</strong></p>
            <p>${employeeName}</p>
            <p>Project: ${projectName}</p>
            <p>Status: ${employeeStatus}</p>
            <!-- Add any additional information you want to display -->
        `;

        employeeListView.appendChild(listItem);
    });
}


function generateListView() {
    const employeeTiles = document.querySelectorAll(".employee-tile");

    employeeTiles.forEach((tile) => {
        const clone = tile.cloneNode(true); // Clone the tile
        clone.classList.remove("employee-tile"); // Remove tile-specific class
        clone.classList.add("list-item"); // Add list item class
        clone.style.display = "block"; // Ensure visibility
        document.getElementById("employee-list-view").appendChild(clone); // Append to list view container
    });
}

function expandTile(tile) {
    const extraInfo = tile.querySelector(".extra-info");
    extraInfo.style.display = "block"; // Expand on hover
}

function collapseTile(tile) {
    const extraInfo = tile.querySelector(".extra-info");
    extraInfo.style.display = "none"; // Collapse when not hovering
}

function sendMail(email) {
    window.location.href = `mailto:${email}`; // Opens default email client
}

function selectAllTiles() {
    const allTiles = document.querySelectorAll(".select-tile");
    const allSelected = Array.from(allTiles).every(tile => tile.checked); // Check if all are selected
    allTiles.forEach(tile => tile.checked = !allSelected); // Toggle select all tiles
}

function selectAllGridRows() {
    const allRows = document.querySelectorAll(".select-row");
    const allSelected = Array.from(allRows).every(row => row.checked); // Check if all are selected
    allRows.forEach(row => row.checked = !allSelected); // Toggle select all rows
}

function viewTimesheet(employeeId) {
    console.log(`Viewing timesheet for employee: ${employeeId}`);
}

    // Implement timesheet viewing logic

function filterByDate() {
    const monthYear = document.getElementById("month-year").value;
    if (!monthYear) return; // If no date selected, skip filtering

    const [selectedYear, selectedMonth] = monthYear.split("-");
    const employeeTiles = document.querySelectorAll(".employee-tile");

    employeeTiles.forEach((tile) => {
        const extraInfo = tile.querySelector(".extra-info");
        if (!extraInfo) {
            tile.style.display = "none"; // If extra-info is missing, hide the tile
            return;
        }

        const sentDateText = extraInfo.querySelector("p:nth-child(4)").innerText.split(":")[1].trim();
        const sentDate = new Date(sentDateText);

        const isMatchingYear = sentDate.getFullYear() === parseInt(selectedYear);
        const isMatchingMonth = sentDate.getMonth() + 1 === parseInt(selectedMonth);

        tile.style.display = (isMatchingYear && isMatchingMonth) ? "block" : "none";
    });
}


function filterByEmployeeType(filterText) {
    const tilesAndItems = document.querySelectorAll('.employee-tile, .list-item');

    tilesAndItems.forEach(element => {
        var tileText = element.innerText || element.textContent;

        if (filterText === 'all' || tileText.includes(filterText)) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}



function searchByName() {
    const searchQuery = document.getElementById('employee-name-search').value.trim().toLowerCase();
    const tilesAndItems = document.querySelectorAll('.employee-tile, .list-item');

    tilesAndItems.forEach(element => {
        const employeeName = element.querySelector('p:nth-child(2)').textContent.toLowerCase(); // Assuming employee name is the second <p> element

        if (employeeName.includes(searchQuery)) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

function searchByName() {
    var input = document.getElementById('employee-name-search').value.trim().toLowerCase();
    var tiles = document.getElementsByClassName('employee-tile');
    for (var i = 0; i < tiles.length; i++) {
        var name = tiles[i].getElementsByTagName('p')[1].innerText.trim().toLowerCase();
        if (name.includes(input)) {
            tiles[i].style.display = 'block';
        } else {
            tiles[i].style.display = 'none';
        }
    }
}

function searchByProject() {
    const searchQuery = document.getElementById('project-name-search').value.trim().toLowerCase();
    const tilesAndItems = document.querySelectorAll('.employee-tile, .list-item');

    tilesAndItems.forEach(element => {
        const project = element.querySelector('p:nth-child(4)').innerText.trim().toLowerCase().split(': ')[1];

        if (project.includes(searchQuery)) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    });
}

function generateGridView() {
    const employeeTiles = document.querySelectorAll(".employee-tile");
    const gridTable = document.getElementById("employee-grid-table");
    
    // Clear existing table content
    gridTable.innerHTML = ""; 

    // Create header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>Select</th>
        <th>Employee ID</th>
        <th>Employee Name</th>
        <th>Email</th>
        <th>Project Name</th>
        <th>Status</th>
        <th>View Timesheet</th>
    `;
    gridTable.appendChild(headerRow);

    // Loop through each employee tile
    employeeTiles.forEach((tile) => {
        // Extract employee information from the tile
        const employeeId = tile.querySelector("p:nth-child(1)").innerText;
        const employeeName = tile.querySelector("p:nth-child(2)").innerText;
        const email = tile.querySelector(".extra-info p:nth-child(1)").innerText.split(": ")[1];
        const projectName = tile.querySelector("p:nth-child(3)").innerText.split(": ")[1];
        const status = tile.querySelector("p:nth-child(4)").innerText.split(": ")[1];

        // Create a row for the employee in the grid table
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="select-row" /></td>
            <td>${employeeId}</td>
            <td>${employeeName}</td>
            <td>${email}</td>
            <td>${projectName}</td>
            <td>${status}</td>
            <td><button onclick="viewTimesheet('${employeeId}')">View</button></td>
        `;
        gridTable.appendChild(row);
    });
}

function viewTimesheet(employeeId) {
    console.log(`Viewing timesheet for employee: ${employeeId}`);
}