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