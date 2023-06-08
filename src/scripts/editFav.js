import { db } from "../../index.js";
import { doc, getDoc, setDoc, updateDoc, arrayRemove } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, updateProfile, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js";

const auth = getAuth();


// Initialize the storage module
const storage = getStorage();

console.log(sessionStorage);

  
// Define the artists array
let artists = [];
// Define the favorites array
let favorites = [];

// Function to retrieve the selected artist from local storage
function getSelectedArtist() {
  const selectedArtist = localStorage.getItem('selectedArtist');
  return selectedArtist ? JSON.parse(selectedArtist) : null;
}

function populateArtistSelection() {
    const editFavoritesButton = document.getElementById("edit-favorites-button");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay", "overlay");
    document.body.appendChild(overlay);

    // Variable to track whether the "Change Favorites" button was clicked
    let isChangeFavoritesClicked = false;
  
    // Create a save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
  
    saveButton.addEventListener("click", () => {
      // Update the user's favorites in Firestore
      updateFavoritesInFirestore();
      // Reload the page
      location.reload();
    });

    editFavoritesButton.addEventListener("click", () => {
      overlay.innerHTML = "";
      overlay.style.display = "block";
  
      // Create a button to allow changing favorites
      const changeFavoritesButton = document.createElement("button");
      changeFavoritesButton.textContent = "Add Favorites";
      changeFavoritesButton.classList.add("change-favorites-button");

      console.log("first");
      overlay.appendChild(saveButton);
  
      changeFavoritesButton.addEventListener("click", () => {
        // Set the variable to true when the "Change Favorites" button is clicked
        console.log("yes. Change Favorites button clicked");
        isChangeFavoritesClicked = true;
        // Clear the favorites array and repopulate the artist selection
        overlay.innerHTML = "";
  
        artists.forEach((artist) => {
          // Check if the artist is not already in the favorites
          if (!isArtistInFavorites(artist)) {
            const artistContainer = createArtistContainer(artist, overlay);
            overlay.appendChild(artistContainer);
          }
        });
  
        overlay.appendChild(saveButton);
      });
  
      overlay.appendChild(changeFavoritesButton);
  
      if (favorites.length > 0) {
        // Loop through each favorite artist and display the image with a remove button
        favorites.forEach((favorite, index) => {
          const favoriteElement = createFavoriteElement(favorite, index, overlay);
          overlay.appendChild(favoriteElement);
        });
      } else {
        // No favorites, display a message
        const noFavoritesMessage = document.createElement("p");
        noFavoritesMessage.textContent = "You don't have any favorites yet.";
        overlay.appendChild(noFavoritesMessage);
      }
    });
  
  }
  
  // Function to check if an artist is already in the favorites
  function isArtistInFavorites(artist) {
    return favorites.some((favorite) => favorite.artist === artist.name);
  }
  
  
  function createArtistContainer(artist, overlay) {
    const artistContainer = document.createElement("div");
    artistContainer.classList.add("artist-container");
  
    const artistElement = createArtistElement(artist, overlay);
    artistContainer.appendChild(artistElement);
  
    return artistContainer;
  }

  function createFavoriteElement(favorite, index, overlay) {
    const favoriteElement = document.createElement("div");
    favoriteElement.classList.add("favorite");
  
    // Create a container for the image and remove overlay
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("favorite-content");
  
    // Create an image element
    const favoriteImage = document.createElement("img");
    favoriteImage.classList.add("favorite-image");
    favoriteImage.src = favorite.url;
  
    // Create a remove overlay
    const removeOverlay = document.createElement("div");
    removeOverlay.classList.add("remove-overlay");
    removeOverlay.textContent = "Remove";
  
    // Add event listeners for hover and click
    favoriteElement.addEventListener("mouseenter", () => {
      removeOverlay.style.display = "block";
      removeOverlay.style.fontFamily = "Sen, sans-serif";
      removeOverlay.style.fontSize = "0.8em";
      removeOverlay.style.transition = "0.3s all ease";
    });
  
    favoriteElement.addEventListener("mouseleave", () => {
      removeOverlay.style.display = "none";
    });
  
    favoriteElement.addEventListener("click", () => {
      console.log("Remove button clicked");
  
      // Remove the artist from sessionStorage
      removeFavoriteFromSessionStorage(index);
  
      // Remove the favorite element from the overlay
      favoriteElement.remove();
  
      // Remove the artist from favorites
      removeFavorite(index);
  
      // Update the user's favorites in Firestore
      updateFavoritesInFirestore();
  
      // Add a new slot for the favorite artist
      addFavoriteSlot(overlay);
    });
  
    // Append the image and remove overlay to the content container
    contentContainer.appendChild(favoriteImage);
    contentContainer.appendChild(removeOverlay);
  
    // Append the content container to the favorite element
    favoriteElement.appendChild(contentContainer);
  
    return favoriteElement;
  }
  
  function addFavoriteSlot(overlay) {
    const favoriteSlot = document.createElement("div");
    favoriteSlot.classList.add("favorite-slot");
  
    const addFavoriteImage = document.createElement("img");
    addFavoriteImage.src = "../resources/img/add-fav.png";
    addFavoriteImage.classList.add("add-favorite-image");
  
    favoriteSlot.appendChild(addFavoriteImage);
  
    overlay.appendChild(favoriteSlot);
  }
  
  
function createArtistElement(artist, overlay) {
  const artistElement = document.createElement("div");
  artistElement.classList.add("artist");

  const artistImage = document.createElement("img");
  artistImage.classList.add("artist-image");
  artistImage.src = artist.image;

  const artistName = document.createElement("span");
  artistName.classList.add("artist-name");

  // Disable selection if the artist is already a favorite
  if (isArtistInFavorites(artist)) {
    artistElement.classList.add("selected");
    artistElement.title = "Already selected as a favorite";
  } else {
    artistImage.addEventListener("click", () => {
      console.log(`Selected artist: ${artist.name}`);

      const selectedArtistDownloadURL = artist.image;
      const selectedArtistName = artist.name;

      const favoriteImage = document.querySelector(".fav-container img[src='../resources/img/add-fav.png']");
      if (favoriteImage) {
        favoriteImage.src = selectedArtistDownloadURL;
        addFavorite(selectedArtistDownloadURL, selectedArtistName);
        updateFavoritesInFirestore();
        addFavoriteToSessionStorage(selectedArtistDownloadURL, selectedArtistName);

        // Mark the artist as selected and remove it from the display
        artist.selected = true;
        artistElement.remove();
      } else {
        console.log("No available favorite slots");
        alert("No available favorite slots");
      }
    });
  }

  artistElement.appendChild(artistImage);
  artistElement.appendChild(artistName);

  return artistElement;
}


// Function to add a favorite to the favorites array
function addFavorite(url, artist) {
  favorites.push({ url, artist });
}

function removeFavorite(index) {
  console.log("removed from fav array");
  favorites.splice(index, 1);

  // Update the favorite images in the profile page
  const favoriteImage = document.getElementById(`fav-image-${index + 1}`);
  if (favoriteImage) {
    favoriteImage.src = "../resources/img/add-fav.png";
  }
}


// Function to update the user's favorites in Firestore
function updateFavoritesInFirestore() {
    const user = auth.currentUser;
    const userId = localStorage.getItem("uid");
  
    if (user && userId) {
      const userRef = doc(db, "users", userId);
      updateDoc(userRef, { favorites })
        .then(() => {
          console.log("Favorites updated successfully");
        })
        .catch((error) => {
          console.error("Error updating favorites:", error);
        });
    }
  }

// Function to add a favorite to sessionStorage
function addFavoriteToSessionStorage(url, artist) {
  const userData = JSON.parse(sessionStorage.getItem("userData")) || {};
  userData.favorites = userData.favorites || [];
  userData.favorites.push({ url, artist });
  sessionStorage.setItem("userData", JSON.stringify(userData));
}

function removeFavoriteFromSessionStorage(index) {
  
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  if (userData && userData.favorites && userData.favorites.length > index) {
    userData.favorites.splice(index, 1);
    sessionStorage.setItem("userData", JSON.stringify(userData));
  }
}


// Move the call to populateFavorites() after defining the function
function populateFavorites() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    favorites = userData ? userData.favorites || [] : [];
  
    // Loop through each favorite and update the corresponding favorite image source
    favorites.forEach((favorite, index) => {
      const favoriteImage = document.getElementById(`fav-image-${index + 1}`);
      if (favoriteImage) {
        favoriteImage.src = favorite.url;
        favoriteImage.addEventListener("click", () => {
          console.log("Favorite artist image clicked");
  
          // Extract the artist name from the favorite object
          const artistName = favorite.artist;
  
          // Redirect to choose-call.html with the artist name as a parameter
          window.location.href = `choose-call.html?band=${encodeURIComponent(artistName)}`;
        });
      }
    });
  }
  

// Retrieve the selected artist from local storage and set the image source
const selectedArtist = getSelectedArtist();
if (selectedArtist) {
  const favoriteImage = document.querySelector(".fav-container img[src='../resources/img/add-fav.png']");
  if (favoriteImage) {
    favoriteImage.src = selectedArtist.image;
  }
}

// Retrieve the list of files from Firebase Storage
const storageRef = ref(storage, 'group-pic');
listAll(storageRef)
  .then((res) => {
    const promises = res.items.map(itemRef => {
      // Get the download URL for each image file
      return getDownloadURL(itemRef)
        .then(url => {
          // Extract the file name from the full path
          const fileName = itemRef.name;
          // Extract the artist name from the file name (assuming the file name is in the format "artistName.jpg")
          const artistName = fileName.split(".")[0];

          // Create an artist object with the name and image URL
          const artist = {
            name: artistName,
            image: url,
            selected: false // Add a selected property to the artist object
          };

          // Add the artist to the artists array
          artists.push(artist);
        })
        .catch((error) => {
          console.error(`Error retrieving image: ${itemRef.name}`, error);
        });
    });

    // Wait for all the download URL promises to resolve
    return Promise.all(promises);
  })
  .then(() => {
    // Call the function to populate the artist selection
    populateArtistSelection();
  })
  .catch((error) => {
    console.error("Error retrieving files from Firebase Storage", error);
  });

export { populateFavorites };
