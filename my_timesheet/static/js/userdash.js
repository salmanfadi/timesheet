// Example user data
const user = {
    name: "Siddharth Ramachandran",
    userId: "IND9999",
    userEmail: "Siddharth.R@kudzuinfotech.com",
    role: "Front End Dev",
    department: "Development",
    projectName: "Timesheet Web App",
    managerName: "Algin Thomas",
    managerEmail: "algin.thomas@kudzuinfotech.com"
};

// Display greeting message
document.getElementById('greeting').innerText = `Hello, 
    ${user.name}`;

// Timesheet button click event
document.getElementById('timesheet-btn').addEventListener('click', function() {
    alert("Timesheet button clicked!");
});

// Profile button click event
document.getElementById('profile-btn').addEventListener('click', function() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('profile-content').style.display = 'flex';
    document.getElementById('profile-name').innerText = `Name: ${user.name}`;
    document.getElementById('profile-id').innerText = `ID: ${user.userId}`;
    document.getElementById('profile-role').innerText = `Role: ${user.role}`;
    document.getElementById('profile-department').innerText = `Department: ${user.department}`;
    document.getElementById('profile-project-name').innerText = `Project Name: ${user.projectName}`;
    document.getElementById('profile-manager-name').innerText = `Manager's Name: ${user.managerName}`;
    document.getElementById('profile-manager-email').innerText = `Manager's Email: ${user.managerEmail}`;
});

// Get and display date and day
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
function logout() {
    // Perform logout actions, such as clearing session data or redirecting to the login page
    // For example, redirecting to the login page:
    window.location.href = "/"; // Update "/login" with the actual URL of your login page
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
document.addEventListener("DOMContentLoaded", function() {
    const greeting = document.getElementById("greeting");
    const greetingText = greeting.textContent;
    greeting.textContent = "";

    greetingText.split("").forEach((letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${index * 0.1}s`;
        greeting.appendChild(span);
    });
});
