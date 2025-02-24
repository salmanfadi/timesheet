function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Show password
    } else {
        passwordInput.type = "password"; // Hide password
    }
}


  // Get the admin login button
var adminLoginBtn = document.querySelector('.admin-login-button');

// Add click event listener to admin login button
adminLoginBtn.addEventListener('click', function() {
    console.log("Admin login button clicked.");
    window.location.href = 'http://localhost:5000/login/admin-dash'; // Redirect to admin dash page
});

