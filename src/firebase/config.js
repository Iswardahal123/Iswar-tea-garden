// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzsdJ3TNyoTlw1IpXj4TuAupZQx71TDng",
  authDomain: "iswar-tea-garden.firebaseapp.com",
  databaseURL: "https://iswar-tea-garden-default-rtdb.firebaseio.com",
  projectId: "iswar-tea-garden",
  storageBucket: "iswar-tea-garden.appspot.com", // ✅ FIXED
  messagingSenderId: "330070107173",
  appId: "1:330070107173:web:22deb21366dcafb8394bcc",
  measurementId: "G-MJ2SJMHS22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
