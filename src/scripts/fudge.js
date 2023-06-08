import { db } from "../../index.js";
import { doc, getDoc, setDoc, updateDoc, arrayRemove } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';
import { getAuth, updateProfile, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js";

const auth = getAuth();
const storage = getStorage();

console.log(sessionStorage);

let artists = [];
let favorites = [];

function getSelectedArtist() {
  const selectedArtist = localStorage.getItem('selectedArtist');
  return selectedArtist ? JSON.parse(selectedArtist) : null;
}

function populateArtistSelection() {
  const editFavButton = document.getElementById("edit-favorites-button");
  const overlay = document.createElement("div");
  const selectedArtist = getSelectedArtist();

  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  let isChangeFavoritesClicked = false;

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("save-button");

  saveButton.addEventListener("click", () => {
    updateFavsInFirestore();
    location.reload();
  });

  editFavButton.addEventListener("click", () => {
    overlay.innerHTML = "";
    overlay.style.display = "block";

    const changeFavButton = document.createElement("button");
    changeFavButton.textContent = "Add Favorites";
    changeFavButton.classList.add("change-favorites-button");

    overlay.appendChild(saveButton);

    changeFavButton.addEventListener("click", () => {
      isChangeFavoritesClicked = true;
      overlay.innerHTML = "";

      artists.forEach((artist) => {
        if (!isArtistInFavorites(artist)) {
          const artistContainer = createArtistContainer(artist, overlay);
          overlay.appendChild(artistContainer);
        }
      });

      overlay.appendChild(saveButton);
    });

    overlay.appendChild(changeFavButton);

    if (favorites.length > 0) {
      favorites.forEach((favorite, index) => {
        const favoriteElement = createFavElement(favorite, index, overlay);
        overlay.appendChild(favoriteElement);
      });
    } else {
      const noFavoritesMessage = document.createElement("p");
      noFavoritesMessage.textContent = "You don't have any favorites yet.";
      overlay.appendChild(noFavoritesMessage);
    }
  });

}

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


function createFavElement(fav, index, overlay) {
    const favEl = document.createElement("div");
    favEl.classList.add("fav");
  
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("fav-content");
  
    const favImage = document.createElement("img");
    favImage.classList.add("fav-image");
    favImage.src = fav.url;
  
    const removeOverlay = document.createElement("div");
    removeOverlay.classList.add("remove-overlay");
    removeOverlay.textContent = "Remove";
  
    favEl.addEventListener("mouseenter", () => {
      removeOverlay.style.display = "block";
    });
  
    favEl.addEventListener("mouseleave", () => {
      removeOverlay.style.display = "none";
    });
  
    favEl.addEventListener("click", () => {
      removeFavFromSessionStorage(index);
      favEl.remove();
      removeFav(index);
      updateFavsInFirestore();
      addFavSlot(overlay);
    });
  
    contentContainer.appendChild(favImage);
    contentContainer.appendChild(removeOverlay);
    favEl.appendChild(contentContainer);
  
    return favEl;
  }
  
  function addFavSlot(overlay) {
    const favSlot = document.createElement("div");
    favSlot.classList.add("fav-slot");
  
    const addFavImage = document.createElement("img");
    addFavImage.src = "../resources/img/add-fav.png";
    addFavImage.classList.add("add-fav-image");
  
    favSlot.appendChild(addFavImage);
    overlay.appendChild(favSlot);
  }
  
  function createArtistElement(artist, overlay) {
    const artistEl = document.createElement("div");
    artistEl.classList.add("artist");
  
    const artistImage = document.createElement("img");
    artistImage.classList.add("artist-image");
    artistImage.src = artist.image;
  
    const artistName = document.createElement("span");
    artistName.classList.add("artist-name");
    artistName.textContent = artist.name;
  
    artistImage.addEventListener("click", () => {
      console.log(`Selected artist: ${artist.name}`);
  
      const selectedArtistURL = artist.image;
      const selectedArtistName = artist.name;
  
      const favImage = document.querySelector(".fav-container img[src='../resources/img/add-fav.png']");
      if (favImage) {
        favImage.src = selectedArtistURL;
        addFav(selectedArtistURL, selectedArtistName);
        updateFavsInFirestore();
        addFavToSessionStorage(selectedArtistURL, selectedArtistName);
      } else {
        console.log("No available favorite slots");
      }
    });
  
    artistEl.appendChild(artistImage);
    artistEl.appendChild(artistName);
  
    return artistEl;
  }
  
  function addFav(url, artist) {
    favorites.push({ url, artist });
  }
  
  function removeFav(index) {
    console.log("removed from fav array");
    favorites.splice(index, 1);
  
    const favImage = document.getElementById(`fav-image-${index + 1}`);
    if (favImage) {
      favImage.src = "../resources/img/add-fav.png";
    }
  }
  
  function updateFavsInFirestore() {
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
  
  function addFavToSessionStorage(url, artist) {
    const userData = JSON.parse(sessionStorage.getItem("userData")) || {};
    userData.favorites = userData.favorites || [];
    userData.favorites.push({ url, artist });
    sessionStorage.setItem("userData", JSON.stringify(userData));
  }
  
  function removeFavFromSessionStorage(index) {
    console.log("Before removal:", sessionStorage.getItem("userData"));
  
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData && userData.favorites && userData.favorites.length > index) {
      userData.favorites.splice(index, 1);
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  
    console.log("After removal:", sessionStorage.getItem("userData"));
  }
  
  function populateFavs() {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    favorites = userData ? userData.favorites || [] : [];
  
    favorites.forEach((fav, index) => {
      const favImage = document.getElementById(`fav-image-${index + 1}`);
      if (favImage) {
        favImage.src = fav.url;
        favImage.addEventListener("click", () => {
          console.log("Favorite artist image clicked");
          const artistName = fav.artist;
          window.location.href = `choose-call.html?band=${encodeURIComponent(artistName)}`;
        });
      }
    });
  }
  
  const selectedArtist = getSelectedArtist();
  if (selectedArtist) {
    const favImage = document.querySelector(".fav-container img[src='../resources/img/add-fav.png']");
    if (favImage) {
      favImage.src = selectedArtist.image;
    }
  }
  
  const storageRef = ref(storage, "group-pic");
  listAll(storageRef)
    .then((res) => {
      const promises = res.items.map(itemRef => {
        return getDownloadURL(itemRef)
          .then(url => {
            const fileName = itemRef.name;
            const artistName = fileName.split(".")[0];
            const artist = {
              name: artistName,
              image: url
            };
            artists.push(artist);
          })
          .catch((error) => {
            console.error(`Error retrieving image: ${itemRef.name}`, error);
          });
      });
  
      return Promise.all(promises);
    })
    .then(() => {
      populateArtistSelection();
    })
    .catch((error) => {
      console.error("Error retrieving files from Firebase Storage", error);
    });
  
  export { populateFavs };
  