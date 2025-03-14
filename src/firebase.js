// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };