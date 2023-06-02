import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../../index.js";
import { collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

const auth = getAuth();


auth.onAuthStateChanged(user => {
    console.log(user)
})

const home = document.querySelector("#home-button");
const logout = document.querySelector("#logout-button");
logout.addEventListener('click', e =>{
  e.preventDefault();
  signOut(auth).then(() => {
    console.log("user signed out");
    window.location.href = "login.html";

  }).catch((error) => {
    // An error happened.
    alert("yut");
  });
})



// home.addEventListener('click', e =>{
//   e.preventDefault();
//   signOut(auth).then(() => {
//     console.log("go to home page");
//     window.location.href = "../../index.html";

//   }).catch((error) => {
//     // An error happened.
//     alert("yut");
//   });
// })

  // export async function registerUser(email, username, password1, password2){

      // try {
      //     if (username === "" || username === " " || password1 === " " || password1 === "") {
      //         throw new Error('Username or Password is empty');
      //         }
              
      //         if (password1 != password2) {
      //           throw new Error('Please make sure passwords match.');
      //         }
      //         if (password1.length < 8) {
      //           throw new Error('Password is weak');
      //         }
  //             try {
  //                 const docRef = await addDoc(collection(db, "users"), {
  //                 email: email,
  //                 username: username,
  //                 password: password2,
  //                 });
  //                 console.log("Document written with ID: ", docRef.id);
  //                 alert("Registered successfully");
  //                 document.getElementById("register").reset();
                  
  //             } catch (e) {
  //                 console.error("Error adding document: ", e);
  //             }
  //     } catch (e) {
  //       alert(e);
  //     }
  