import { db } from "../../index.js";
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

const auth = getAuth();

const loadProfileData = async () => {
  const storedUID = localStorage.getItem("uid");

  if (storedUID) {
    try {
      // Retrieve user data from Firestore using the stored UID
      const docRef = doc(db, "users", storedUID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("Document data:", userData);

        // Store user data in session storage
        sessionStorage.setItem("userData", JSON.stringify(userData));

        const { username, bio, name, profilePicture } = userData;
        document.getElementById("user-name").textContent = name;
        document.getElementById("user-tag").textContent = username;
        document.getElementById("user-bio").textContent = bio;
        document.getElementById("profile-pic").src = profilePicture;
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("User is not logged in!");
    window.location.href = "login.html"; // Redirect to the login page if user is not logged in
  }
};

loadProfileData(); // Call the function immediately

// Export the loadProfileData function to make it accessible from other scripts
export { loadProfileData };
