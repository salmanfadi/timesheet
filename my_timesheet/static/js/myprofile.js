// Example user data
const user = {
    name: "Siddharth Ramachandran",
    userId: "IND09999",
    role: "Full Stack Developer",
    department: "Product Team",
    email: "Siddharth.r@Kudzuinfotech.com",
    project: "Timesheet Web App",
    clientCompany: "Kudzu Infotech",
    manager: "Algin Thomas",
    managerEmail: "algin.thomas@kudzuinfotech.com"
};

// Display profile information
document.getElementById('profile-name').innerText = `Name: ${user.name}`;
document.getElementById('profile-id').innerText = `User ID: ${user.userId}`;
document.getElementById('profile-role').innerText = `Role: ${user.role}`;
document.getElementById('profile-department').innerText = `Department: ${user.department}`;
document.getElementById('profile-email').innerText = `Email: ${user.email}`;
document.getElementById('profile-project').innerText = `Project: ${user.project}`;
document.getElementById('profile-client-company').innerText = `Client Company: ${user.clientCompany}`;
document.getElementById('profile-manager').innerText = `Manager: ${user.manager}`;
document.getElementById('profile-manager-email').innerHTML = `Manager's Email: <a href="#">${user.managerEmail}</a>`;

// Modal handling
const modal = document.getElementById("email-modal");
const closeModal = document.getElementsByClassName("close")[0];

// Open email modal when manager's email is clicked
document.getElementById('profile-manager-email').addEventListener('click', function() {
    document.getElementById('email-to').value = user.managerEmail;
    modal.style.display = "flex";
});

// Close the modal when the close button is clicked
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking outside of the modal content
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Handle email form submission
document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const to = document.getElementById('email-to').value;
    const subject = document.getElementById('email-subject').value;
    const message = document.getElementById('email-message').value;
    const attachments = document.getElementById('email-attachments').files;

    // Here you would handle the email sending process
    // This is a placeholder for demonstration purposes
    console.log("Email sent to:", to);
    console.log("Subject:", subject);
    console.log("Message:", message);
    console.log("Attachments:", attachments);

    alert("Email sent successfully!");

    // Close the modal after sending the email
    modal.style.display = "none";
});
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });

    document.getElementById('date').innerText = dateStr;
}

// Fetch and display weather information based on coordinates
async function fetchWeather(latitude, longitude) {
    const apiKey = '50a310eb25b016ca855c3e995f9559a0';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    console.log('Fetching weather from URL:', url); // Debugging: Log the URL
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Weather data:', data); // Debugging: Log the response data
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        document.getElementById('weather').innerText = `Weather: ${weatherDescription}, ${temperature}°C`;
    } catch (error) {
        document.getElementById('weather').innerText = 'Weather: Unable to fetch data';
        console.error('Error fetching weather data:', error);
    }
}

// Get user's location and fetch weather data
function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Location obtained:', latitude, longitude); // Debugging: Log the coordinates
            fetchWeather(latitude, longitude);
        }, (error) => {
            document.getElementById('weather').innerText = 'Weather: Unable to get location';
            console.error('Error getting location:', error);
        });
    } else {
        document.getElementById('weather').innerText = 'Weather: Geolocation not supported';
    }
}

// Update the date and time on page load
updateDateTime();

// Get location and fetch weather information on page load
getLocationAndWeather();

