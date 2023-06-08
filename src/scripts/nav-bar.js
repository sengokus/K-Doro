// Define the updateLoginButton function within the global scope
window.updateLoginButton = async () => {
  const storedUID = localStorage.getItem("uid");

  if (storedUID) {
    try {
      // User is logged in
      const loginButton = document.getElementById("login-button");
      loginButton.textContent = "Profile";
      loginButton.href = "profile.html";

      const homeButton = document.getElementById("home-button");
      homeButton.textContent = "Profile";
      homeButton.href = "profile.html";
    } catch (error) {
      // Handle the error
    }
  }
};

// Call the updateLoginButton function immediately
window.updateLoginButton();

