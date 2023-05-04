import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../../index.js";
import { collection } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';


// Get the registration form
const registerForm = document.getElementById("register");

// Add event listener for form submission
registerForm.addEventListener("submit", (event) => {
	event.preventDefault(); // prevent the default form submission behavior

	// Get the user's email, username, and password
	const email = document.getElementById("user_email").value;
	const username = document.getElementById("user_name").value;
	const password1 = document.getElementById("user_password1").value;
	const password2 = document.getElementById("user_password2").value;

	// TODO: Use the email, username, and password to register the user
	console.log(`Registering user: ${email}, ${username}, ${password1}`);
	registerUser(email,username,password1, password2);
});


export async function registerUser(email, username, password1, password2) {
    try {
        if (username === "" || username === " " || password1 === " " || password1 === "") {
            throw new Error('Username or Password is empty');
            }
            
            if (password1 != password2) {
              throw new Error('Please make sure passwords match.');
            }
            if (password1.length < 8) {
              throw new Error('Password is weak');
            }
             try {
                const docRef = await addDoc(collection(db, "users"), {
                email: email,
                username: username,
                password: password2,
                });
                console.log("Document written with ID: ", docRef.id);
                alert("Registered successfully");
                document.getElementById("register").reset();
                
            } catch (e) {
                console.error("Error adding document: ", e);
            }
    	} catch (e) {
    		alert(e);
    }
}