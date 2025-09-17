import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyDIRbKlu8curxshosoYGPSpkoiMLqNQVXs",
  authDomain: "movies-database-24544.firebaseapp.com",
  projectId: "movies-database-24544",
  storageBucket: "movies-database-24544.firebasestorage.app",
  messagingSenderId: "681566398959",
  appId: "1:681566398959:web:11c4db1705b3d5dec1ee1a",
  measurementId: "G-5TMQXTQQMJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
//const analytics = getAnalytics(app);