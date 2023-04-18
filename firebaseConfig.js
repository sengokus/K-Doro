import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
let db;
// configures the firebase
export function firebaseConfig() {

  const firebaseConfig = {
    apiKey: "AIzaSyAMEeuzMO-0LrdVvXn2_PoQqNbp_WGYfNo",
    authDomain: "kdoro-f0528.firebaseapp.com",
    projectId: "kdoro-f0528",
    storageBucket: "kdoro-f0528.appspot.com",
    messagingSenderId: "802385501756",
    appId: "1:802385501756:web:5a3eee93d11e06cdccad39"
    };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}
export {db};