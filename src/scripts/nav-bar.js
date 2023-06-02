import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

// Function to update the login button based on the user's authentication state
function updateLoginButton() {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log('updateLoginButton');

  if (user) {
    // User is logged in
    const loginButton = document.getElementById("login-button");
    loginButton.textContent = "Profile";
    loginButton.href = "./src/profile.html";



    const homeButton = document.getElementById("home-button");
    homeButton.textContent = "Profile";
    homeButton.href = "./src/login.html";
  }
}

// Add an event listener for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", updateLoginButton);
