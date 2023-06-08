function randomizeImage() {
    var imgCard = document.getElementById("img-card");
    var images = [
      "giselle-1.jpg",
      "heejin-1.jpg",
      "irene-1.jpg",
      "joy-1.jpg",
      "karina-1.jpg",
      "ning-1.jpg",
      "seulgi-1.png",
      "tsuki-1.jpg",
      "winter-1.jpg",
      "wendy-1.jpg",
      "yeri-1.png"];
    var randImg = images[Math.floor(Math.random() * images.length)];
  
    imgCard.src = "../resources/img/" + randImg;
    // console.log(randImg);
}

// waits for the page to load before randomizing the image
window.addEventListener("load", randomizeImage());