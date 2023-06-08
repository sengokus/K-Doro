window.updateLoginButton = async () => {
    const storedUID = localStorage.getItem("uid");

    if (storedUID) {
        try {
            const loginButton = document.getElementById("login-button");
            loginButton.textContent = "Profile";
            loginButton.href = "profile.html";

            const homeButton = document.getElementById("home-button");
            homeButton.textContent = "Profile";
            homeButton.href = "profile.html";
        } catch (error) {
            //
        }
    }
};

window.updateLoginButton();