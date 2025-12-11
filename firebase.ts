import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuration from your screenshot
const firebaseConfig = {
  apiKey: "AIzaSyBKSZaUmAnmgVGf8CPCRveLwkN8TFzeNuY",
  authDomain: "kidzyaiapp.firebaseapp.com",
  projectId: "kidzyaiapp",
  storageBucket: "kidzyaiapp.firebasestorage.app",
  messagingSenderId: "840750221854",
  appId: "1:840750221854:web:d10ce565505bfa68f6bc0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); 
