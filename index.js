// functions for app

import { addUser } from "./db/addUser.js";
import { firebaseConfig } from "./firebaseConfig.js"

firebaseConfig();
addUser();
