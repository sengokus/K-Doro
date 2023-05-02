import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../index.js";
import { collection } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';


// Get the registration form
const registerForm = document.getElementById("register");

// Add event listener for form submission
registerForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default form submission behavior

  // Get the user's email, username, and password
  const email = document.getElementById("user_email").value;
  const username = document.getElementById("user_name").value;
  const password = document.getElementById("user_password").value;

  // TODO: Use the email, username, and password to register the user
  console.log(`Registering user: ${email}, ${username}, ${password}`);
  registerUser(email,username,password);
});


export async function registerUser(email, username, password){

    try {
        if (username === "" || username === " " || password === " " || password === "") {
            throw new Error('Username or Password is empty');
            }
        
            if (password.length < 3) {
            throw new Error('Password is weak');
            }
        
        
            try {
                const docRef = await addDoc(collection(db, "users"), {
                email: email,
                username: username,
                password: password
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
    } catch (e) {
      alert(e);
    }
 }