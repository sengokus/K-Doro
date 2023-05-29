import { addDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { db } from "../../index.js";
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

const auth = getAuth();

auth.onAuthStateChanged(async user => {
    console.log("tangina")
    console.log(user)
    console.log("pota")
    console.log(user.uid)
    console.log("ahay")
    // if (user){
    //     console.log("user logged in successfully", user);
    //     db.collection('users').onSnapshot(snapshot =>{
    //         username(snapshot.docs);
    //         setupUI(user);
    //     }).catch(err=>{
    //         console.log(err.message)
    //     });
        
    // }else{
    //     setupUI();
    //     console.log("yudi-")
    //     console.log("user logged out");
    // }

        // Get data
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    const userData = docSnap.data();
    console.log("Document data 444:", userData);

    // Assign values to variables
    const { username, bio, name} = userData;

    // Set values in HTML elements
    document.getElementById("user-name").innerHTML = name;
    document.getElementById("user-tag").innerHTML = username;
    document.getElementById("user-bio").innerHTML = bio;

    } else {
    console.log("No such document!");
    }

    // //get data
    // const docRef = doc(db, "users", user.uid);
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    // } else {
    // // docSnap.data() will be undefined in this case
    // console.log("No such document!");
    // }
    //     document.getElementById("user-name").innerHTML = username;
    //     document.getElementById("user-tag").innerHTML = username;
    //     document.getElementById("user-bio").innerHTML = bio;

});




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
    .then((userCredential) => {
        // Signed in 
        alert("naks sakto");
        console.log(userCredential.user)
        window.location.href = "profile.html";
        
        // ...
    })
    .catch(error => alert(error.message));
  
  });


