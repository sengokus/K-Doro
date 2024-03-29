import { db } from "../../index.js";
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, updateProfile, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js";

const auth = getAuth();
const editForm = document.getElementById("edit-profile-form");
const nameField = document.getElementById("edit-name");
const tagField = document.getElementById("edit-tag");
const bioField = document.getElementById("edit-bio");
const profilePictureInput = document.getElementById("edit-profile-picture");

function previewProfilePicture(event) {
    const file = event.target.files[0];
    const profilePicturePreview = document.getElementById("profile-pic");

    const reader = new FileReader();
    reader.onload = function () {
        profilePicturePreview.src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        profilePicturePreview.src = "";
    }
}

profilePictureInput.addEventListener("change", previewProfilePicture);

const updateProfileData = async (name, username, bio, profilePicture) => {
    try {
        const userId = localStorage.getItem("uid");
        if (!userId) {
            throw new Error("User ID not found in local storage.");
        }

        const user = auth.currentUser;

        // if the user is not already signed in, sign in using the stored UID
        if (!user) {
            await signInAnonymously(auth);
        }

        const updatedUser = auth.currentUser;

        const storedUserData = sessionStorage.getItem("userData");
        let userData = storedUserData ? JSON.parse(storedUserData) : {};

        if (profilePicture) {
            const storageRef = ref(getStorage(), `profile-pictures/${userId}`);
            await uploadBytes(storageRef, profilePicture);
            const profilePictureUrl = await getDownloadURL(storageRef);

            await setDoc(doc(db, "users", userId), {
                name: name,
                username: "@" + username,
                bio: bio,
                profilePicture: profilePictureUrl,
                favorites: userData.favorites || [] // preserve favorites
            });

            userData = {
                ...updatedUser,
                name: name,
                username: "@" + username,
                bio: bio,
                profilePicture: profilePictureUrl,
                favorites: userData.favorites || [] // preserve favorites
            };
            sessionStorage.setItem("userData", JSON.stringify(userData));
        } else {
            await setDoc(doc(db, "users", userId), {
                name: name,
                username: "@" + username,
                bio: bio,
                profilePicture: userData.profilePicture || "",
                favorites: userData.favorites || [] // preserve favorites
            });

            userData = {
                ...updatedUser,
                name: name,
                username: "@" + username,
                bio: bio,
                profilePicture: userData.profilePicture || "",
                favorites: userData.favorites || [] // preserve favorites 
            };
            sessionStorage.setItem("userData", JSON.stringify(userData));
        }
        alert("Profile updated successfully!")
        location.reload();
    } catch (e) {
        alert(e);
    }
};

editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // get the user's name, username, bio, and profile picture
    const name = nameField.value;
    const username = tagField.value;
    const bio = bioField.value;
    const profilePicture = profilePictureInput.files[0];

    // update the user's profile data
    updateProfileData(name, username, bio, profilePicture);
});