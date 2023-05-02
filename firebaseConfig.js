import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';


export function initFirebase() {
  const firebaseConfig = {
  apiKey: "AIzaSyAMEeuzMO-0LrdVvXn2_PoQqNbp_WGYfNo",
  authDomain: "kdoro-f0528.firebaseapp.com",
  projectId: "kdoro-f0528",
  storageBucket: "kdoro-f0528.appspot.com",
  messagingSenderId: "802385501756",
  appId: "1:802385501756:web:5a3eee93d11e06cdccad39"
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
}

export function initDb(app) {
  return getFirestore(app);
}
