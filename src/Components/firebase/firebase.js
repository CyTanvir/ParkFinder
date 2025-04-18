import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  

const firebaseConfig = {
  apiKey: "AIzaSyCrP70yMAlrcT5Ssb8qUlQ7wLR0bks8jIA",
  authDomain: "parkfinder-a4469.firebaseapp.com",
  projectId: "parkfinder-a4469",
  storageBucket: "parkfinder-a4469.firebasestorage.app",
  messagingSenderId: "482129506256",
  appId: "1:482129506256:web:051bb2cdf3655f0a97d3d5",
  measurementId: "G-90S3NS326J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };