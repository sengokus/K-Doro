// functions for app

import { addUser } from "./db/addUser.js";
import { firebaseConfig } from "./firebaseConfig.js"

firebaseConfig();
addUser();

// change group.html to group user selected
function setGroup(group) {
  var groupContainers = document.querySelectorAll(".group-select");

  for (var i = 0; i < groupContainers.length; i++) {
    groupContainers[i].style.display = "none";
  }

  var selectedGroup = document.getElementById("group-" + group);
  selectedGroup.style.display = "flex";
  console.log(selectedGroup);
}

function randomizeImage() {
  var imgCard = document.getElementById("img-card");
  var images = [
    "../resources/img/giselle-1.jpg",
    "../resources/img/heejin-1.jpg",
    "../resources/img/irene-1.jpg",
    "../resources/img/joy-1.jpg",
    "../resources/img/karina-1.jpg",
    "../resources/img/ning-1.jpg",
    "../resources/img/seulgi-1.png",
    "../resources/img/tsuki-1.jpg",
    "../resources/img/winter-1.jpg"];
  var randImg = images[Math.floor(Math.random() * images.length)];

  imgCard.src = randImg;
}