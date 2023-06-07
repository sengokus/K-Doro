import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js";

// Initialize the storage module
const storage = getStorage();

// Define the artists array
let artists = [];

// Function to populate the artist selection
function populateArtistSelection() {
  const editFavoritesButton = document.getElementById("edit-favorites-button");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  editFavoritesButton.addEventListener("click", () => {
    overlay.style.display = "block";
  });

  const artistSelection = document.createElement("div");
  artistSelection.classList.add("artist-selection");

  artists.forEach(artist => {
    const artistElement = document.createElement("div");
    artistElement.classList.add("artist");

    // Create an image element
    const artistImage = document.createElement("img");
    artistImage.classList.add("artist-image");

    // Set the source of the image to the artist's image URL
    artistImage.src = artist.image;

    // Create a span element for the artist's name
    const artistName = document.createElement("span");
    artistName.classList.add("artist-name");
    artistName.textContent = artist.name;

    // Add the image and name elements to the artist element
    artistElement.appendChild(artistImage);
    artistElement.appendChild(artistName);

    artistElement.addEventListener("click", () => {
      // Perform the necessary actions when an artist is selected
      // For example, add the artist to favorites and redirect to the choose-call.html page for that specific artist
      console.log(`Selected artist: ${artist.name}`);
      // Perform the redirect here
    });

    artistSelection.appendChild(artistElement);
  });

  overlay.appendChild(artistSelection);
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
            image: url
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
