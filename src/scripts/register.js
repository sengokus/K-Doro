import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../../index.js";
import { collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

// Get the registration form
const registerForm = document.getElementById("register");
const auth = getAuth();

// Add event listener for form submission
registerForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default form submission behavior

  // Get the user's email, username, and password
  const email = document.getElementById("user_email").value;
  const username = document.getElementById("user_name").value;
  const password1 = document.getElementById("user_password1").value;
  const password2 = document.getElementById("user_password2").value;

  // TODO: Use the email, username, and password to register the user
  console.log(`Registering user.`);
  //registerUser(email, username, password1, password2);
  try {
    if (username === "" || username === " " || password1 === " " || password1 === "") {
        throw new Error('Username or Password is empty');
        }
        
        if (password1 != password2) {
          throw new Error('Please make sure passwords match.');
        }

      createUserWithEmailAndPassword(auth, email, password2)
      .then(async (userCredential) => {
        // Signed in
        const userId = userCredential.user.uid;
        await setDoc(doc(db, "users", userId), {
          name: username,
          username: "@" + username,
          bio: "Edit bio.",
          profilePicture: "https://firebasestorage.googleapis.com/v0/b/kdoro-f0528.appspot.com/o/profile-pictures%2Fdefault-profile.png?alt=media&token=45b2ff73-7964-4c24-aed2-04473d5758b1",
          favorites: [], // Add an empty array for favorites
        });
    })
      
    .then(() => {
      // Redirect to the desired page after successful registration
      window.alert("Registration successful!");
      window.location.href = "login.html";
    })
      .catch(error => alert(error.message));
    } catch (e) {
      alert(e);
    }
});

// Get the logout button
const logout = document.querySelector("logout-button");
// Add event listener for logout button
logout.addEventListener('click', e =>{
  e.preventDefault();
  auth.signOut.then(() => { //sign out the user
    console.log("user signed out successfully.");
  })
})
