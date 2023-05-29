
import { db } from "../../index.js";
import {doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

const auth = getAuth();
const editForm = document.getElementById("edit-profile-form");

// Add a new document in collection "cities"
// Add event listener for form submission
editForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default form submission behavior
  
  // Get the user's email, username, and password
  const name = document.getElementById("edit-name").value;
  const username = document.getElementById("edit-tag").value;
  const bio = document.getElementById("edit-bio").value;

  // TODO: Use the email, username, and password to register the user
  console.log(`Updating user: ${name}, ${username}, ${bio}`);
  //registerUser(email, username, password1, password2);
  try {

    auth.onAuthStateChanged(async user => {
      console.log("edit")
      console.log(user)
      console.log("profile")
      console.log(user.uid)
      console.log("now")

        const userId = user.uid;
        await setDoc(doc(db, "users", userId),{
          name: name,
          username: "@" + username,
          bio: bio
        });
        location.reload();
      })
      
      // // Get data
      // const docRef = doc(db, "users", user.uid);
      // const docSnap = await getDoc(docRef);
  
      // if (docSnap.exists()) {
      // const userData = docSnap.data();
      // console.log("Document data:", userData);
  
      // // Assign values to variables
      // const { username, bio } = userData;
  
      // // Set values in HTML elements
      // document.getElementById("user-name").innerHTML = username;
      // document.getElementById("user-tag").innerHTML = username;
      // document.getElementById("user-bio").innerHTML = bio;
  
      // } else {
      // console.log("No such document!");
      // }
  
    } catch (e) {
      alert(e);
    }
});


