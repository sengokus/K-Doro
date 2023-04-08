// function changeToRegister() {
//     const changeToRegisterBtn = document.querySelector("#changeToRegister");
//     const changeToLogin = document.querySelector("#changeToLogin");
//     const loginForm = document.querySelector("#login");
//     const registerForm = document.querySelector("#register");
//     changeToRegisterBtn.addEventListener("click", () => {
//         loginForm.classList.remove("active")
//         registerForm.classList.add("active")
//     })
// }
// changeToRegister();


// function changeToLogin() {
//     const changeToLoginBtn = document.querySelector("#changeToLogin");
//     const loginForm = document.querySelector("#login");
//     const registerForm = document.querySelector("#register");
//     changeToLoginBtn.addEventListener("click", () => {
//         loginForm.classList.add("active")
//         registerForm.classList.remove("active")
//     })
// }
// changeToLogin();


// function activeInput(event) {
//     if (screen.width > 600) {
//         let input = event;
//         input.style.border = "1px solid #4054D2";
//     }
// }
// activeInput()

// function loadPage(url) {
//     fetch("login_2.html")
//       .then(response => {
//         return response.text();
//       })
//       .then(data => {
//         // Create a new DOM parser
//         const parser = new DOMParser();
//         // Parse the new page's HTML
//         const newPage = parser.parseFromString(data, "text/html");
//         // Get the new page content and add it to the page container
//         const pageContainer = document.querySelector("#page-container");
//         pageContainer.innerHTML = newPage.querySelector("#page-container").innerHTML;
  
//         // Add the "page" class to the new page element
//         const page = document.querySelector(".page");
//         page.classList.add("page-enter");
  
//         // Wait for the "enter" transition to finish, then remove the "page-enter" class
//         setTimeout(function() {
//           page.classList.remove("page-enter");
//           page.classList.add("page-enter-active");
//         }, 1);
  
//         // Wait for the "exit" transition to finish, then remove the old page element
//         const oldPage = document.querySelector(".page-exit-active");
//         if (oldPage) {
//           setTimeout(function() {
//             oldPage.remove();
//           }, 300);
//         }
  
//         // Update the URL in the browser address bar
//         history.pushState(null, null, "login_2.html");
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }
  
  
  
  
  