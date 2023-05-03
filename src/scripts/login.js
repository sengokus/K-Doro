function loginUser() {
    const loginBtn = document.getElementById("login-button");
  
    loginBtn.addEventListener("click", () => {
        const loginLabels = document.querySelectorAll(".login-label");
  
        loginLabels.forEach(label => {
            label.textContent = "Profile";
            if (window.location.pathname.includes("index.html")) {
                label.href = "./src/profile.html";
            } else {
                label.href = "./profile.html";
            }
        });
    });
}