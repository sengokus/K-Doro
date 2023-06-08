import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../../index.js";
import { collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

const auth = getAuth();

auth.onAuthStateChanged(user => {
    console.log(user);
});

const logout = document.querySelector("#logout-button");

logout.addEventListener('click', e => {
    e.preventDefault();
    signOut(auth).then(() => {
        console.log("User has signed out.");
        
        // clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "../../index.html";
    }).catch((error) => {
        //
    });
});