import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../../index.js";
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

const auth = getAuth();

const loginForm = document.getElementById("login");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // get the user's email, username, and password
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;
  
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        // signed in successfully
        alert("Login successful!");
        console.log(userCredential.user);

        // retrieve user data from Firestore
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("Document data:", userData);

            // store the user's UID in local storage
            localStorage.setItem("uid", userCredential.user.uid);

            // redirect to profile.html
            window.location.href = "profile.html";
        } else {
            console.log("No such document!");
        }
    })
    .catch(error => alert(error.message));
});