import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzsdJ3TNyoTlw1IpXj4TuAupZQx71TDng",
  authDomain: "iswar-tea-garden.firebaseapp.com",
  projectId: "iswar-tea-garden",
  storageBucket: "iswar-tea-garden.appspot.com",
  messagingSenderId: "330070107173",
  appId: "1:330070107173:web:22deb21366dcafb8394bcc",
  measurementId: "G-MJ2SJMHS22"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(); // ✅ Added

export { auth, db, provider };
