function redirectToHomePage() {
    const storedUID = localStorage.getItem("uid");
  
    if (storedUID) {
        console.log(storedUID);
        window.location.href= "home.html";
    } else {
      window.location.href = "../index.html";
    }
  }
  