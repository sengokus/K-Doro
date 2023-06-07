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

// Function to prefill the edit profile form with user data
const prefillEditProfileForm = (userData) => {
  nameField.value = userData.name;
  tagField.value = userData.username.replace('@', '');
  bioField.value = userData.bio;
};

// Function to update the user's profile data
const updateProfileData = async (name, username, bio, profilePicture) => {
  try {
    const userId = localStorage.getItem("uid");
    if (!userId) {
      throw new Error("User ID not found in local storage.");
    }

    // Get the user's current authentication state
    
    const user = auth.currentUser;

    // If the user is not already signed in, sign in using the stored UID
    if (!user) {
      signInAnonymously(auth);
    }

    // Get the updated user object
    const updatedUser = auth.currentUser;

    // Retrieve user data from session storage
    const storedUserData = sessionStorage.getItem("userData");
    let userData = storedUserData ? JSON.parse(storedUserData) : {};

    // Update the user's profile picture if a new one is selected
    if (profilePicture) {
      const storageRef = ref(getStorage(), `profile-pictures/${userId}`);
      await uploadBytes(storageRef, profilePicture);
      const profilePictureUrl = await getDownloadURL(storageRef);

      await setDoc(doc(db, "users", userId), {
        name: name,
        username: "@" + username,
        bio: bio,
        profilePicture: profilePictureUrl
      });

      // Update user data in session storage
      userData = {
        ...updatedUser,
        name: name,
        username: "@" + username,
        bio: bio,
        profilePicture: profilePictureUrl
      };
      sessionStorage.setItem("userData", JSON.stringify(userData));
    } else {
      // If no new profile picture is selected, update the other fields only
      await setDoc(doc(db, "users", userId), {
        name: name,
        username: "@" + username,
        bio: bio,
        profilePicture: userData.profilePicture || "",
      });

      // Update user data in session storage
      userData = {
        ...updatedUser,
        name: name,
        username: "@" + username,
        bio: bio,
        profilePicture: userData.profilePicture || ""
      };
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }

    location.reload();
  } catch (e) {
    alert(e);
  }
};


editForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the default form submission behavior

  // Get the user's name, username, bio, and profile picture
  const name = nameField.value;
  const username = tagField.value;
  const bio = bioField.value;
  const profilePicture = profilePictureInput.files[0];

  // Update the user's profile data
  updateProfileData(name, username, bio, profilePicture);
});

// Retrieve user data from session storage and prefill the edit profile form
const userData = JSON.parse(sessionStorage.getItem("userData"));
if (userData) {
  prefillEditProfileForm(userData);
}
