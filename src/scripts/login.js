import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../../index.js";
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

const auth = getAuth();

// // Set persistence to local
// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     // Continue with your auth state change listener and other code
//     auth.onAuthStateChanged(async (user) => {
//       // Rest of your code here
//     });
//   })
//   .catch((error) => {
//     // Handle the error
//     console.error("Error setting persistence:", error);
//   });
  
// auth.onAuthStateChanged(async (user) => {
//     console.log("tangina")
//     console.log(user)
//     console.log("pota")
//     console.log(user.uid)
//     console.log("ahay")


//         // Get data
//     const docRef = doc(db, "users", user.uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//     const userData = docSnap.data();
//     console.log("Document data:", userData);

//     // Assign values to variables
//     const { username, bio, name, profilePicture} = userData;
//     const img = document.getElementById("profile-pic");

//     // Set values in HTML elements
//     document.getElementById("user-name").innerHTML = name;
//     document.getElementById("user-tag").innerHTML = username;
//     document.getElementById("user-bio").innerHTML = bio;
//     img.setAttribute('src', profilePicture);

//     } else {
//     console.log("No such document!");
//     }
// });




const loginForm = document.getElementById("login");


loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent the default form submission behavior
  
    // Get the user's email, username, and password
    const email = document.getElementById("email-login").value;
    const password = document.getElementById("password-login").value;
  
    // TODO: Use the email, username, and password to register the user
    console.log(`Signing user: ${email}, ${password}`);
    //registerUser(email,username,password1, password2);
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        // Signed in successfully
        alert("naks sakto");
        console.log(userCredential.user);

        // Retrieve user data from Firestore
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("Document data:", userData);

            /// Store the user's UID in local storage
            localStorage.setItem("uid", userCredential.user.uid);

            // Redirect to profile.html
            window.location.href = "profile.html";
        } else {
            console.log("No such document!");
        }
    })
    .catch(error => alert(error.message));
});
