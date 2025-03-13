// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6tN_v-U9hx0WrFGiz7WzKmdmxEWEcFAI",
  authDomain: "home-app-41396.firebaseapp.com",
  databaseURL: "https://home-app-41396-default-rtdb.firebaseio.com",
  projectId: "home-app-41396",
  storageBucket: "home-app-41396.firebasestorage.app",
  messagingSenderId: "963538026450",
  appId: "1:963538026450:web:43837f2aaa088af4b7d20b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);
auth.languageCode = "en"; // Set explicit language

// Initialize Firestore with error handling
let db;
try {
  db = getFirestore(app);
} catch (e) {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
    experimentalForceLongPolling: true,
  });
}

// Enhanced auth state handling
onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth).catch((error) => {
      console.error("Anonymous auth failed:", error);
      // Add UI error handling here if needed
    });
  }
});

export { db, auth };
