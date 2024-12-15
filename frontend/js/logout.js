document.addEventListener("DOMContentLoaded", () => {
    const logoutConfirmButton = document.getElementById("logout-confirm");
    const logoutCancelButton = document.getElementById("logout-cancel");

    // Handle logout confirmation
    logoutConfirmButton.addEventListener("click", () => {
        // Clear token or session storage
        localStorage.removeItem("token");
        alert("You have been logged out.");
        window.location.href = "login.html"; // Redirect to the login page
    });

    // Handle cancel action
    logoutCancelButton.addEventListener("click", () => {
        window.location.href = "index.html"; // Redirect back to the dashboard or previous page
    });
});
