import { db } from "../../index.js";
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js";

const auth = getAuth();
const editForm = document.getElementById("edit-profile-form");
const nameField = document.getElementById("edit-name");
const tagField = document.getElementById("edit-tag");
const bioField = document.getElementById("edit-bio");


const edit = document.getElementById("edit-button");

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

const profilePictureInput = document.getElementById("edit-profile-picture");
profilePictureInput.addEventListener("change", previewProfilePicture);

edit.addEventListener('click', async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data();

      document.getElementById("edit-name").value = userData.name;
      document.getElementById("edit-tag").value = userData.username.replace('@', '');
      document.getElementById("edit-bio").value = userData.bio;
    }
  } catch (e) {
    console.error(e);
  }
});

// Add event listener for form submission
editForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // prevent the default form submission behavior

  // Get the user's name, username, bio, and profile picture
  const name = nameField.value;
  const username = tagField.value;
  const bio = bioField.value;
  const profilePicture = profilePictureInput.files[0];

  // TODO: Use the name, username, bio, and profile picture to update the user's profile

  try {
    const user = auth.currentUser;
    const userId = user.uid;
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();
    if (user) {
      const userId = user.uid;
      
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
        const updatedUserData = {
          ...userData,
          name: name,
          username: "@" + username,
          bio: bio,
          profilePicture: profilePictureUrl
        };
        sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
      

      } else {
        // If no new profile picture is selected, update the other fields only
        await setDoc(doc(db, "users", userId), {
          
          name: name,
          username: "@" + username,
          bio: bio,
          profilePicture: userData.profilePicture,
        });
        // Update user data in session storage
        const updatedUserData = {
          ...userData,
          name: name,
          username: "@" + username,
          bio: bio
        };
        sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
      
      }
      
      location.reload();
    }
  } catch (e) {
    alert(e);
  }
});