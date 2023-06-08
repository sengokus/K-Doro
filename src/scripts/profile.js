import { db } from "../../index.js";
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { populateFavorites } from "./editFav.js"; // import the populateFavorites function

const auth = getAuth();

const loadProfileData = async () => {
    const storedUID = localStorage.getItem("uid");

    if (storedUID) {
        try {
            // retrieve user data from Firestore using the stored UID
            const docRef = doc(db, "users", storedUID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log("Document data stored.");

                // store user data in session storage
                sessionStorage.setItem("userData", JSON.stringify(userData));
                console.log("sessionStorage", sessionStorage)

                const { username, bio, name, profilePicture } = userData;
                document.getElementById("user-name").textContent = name;
                document.getElementById("user-tag").textContent = username;
                document.getElementById("user-bio").textContent = bio;
                document.getElementById("profile-pic").src = profilePicture;

                // prefill the edit form
                document.getElementById("edit-name").value = name;
                document.getElementById("edit-tag").value = username.replace('@', '');
                document.getElementById("edit-bio").value = bio;

                // call the function to populate the favorites
                populateFavorites();
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("User is not logged in!");
        window.location.href = "login.html"; // redirect to the login page if the user is not logged in
    }
};

loadProfileData();

// export the loadProfileData function to make it accessible from other scripts
export { loadProfileData };