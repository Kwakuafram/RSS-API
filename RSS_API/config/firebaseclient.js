// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlARZ_5aB6VSKIU90UzKdNLzFKuy4u-NM",
  authDomain: "rss-feed-cb7c4.firebaseapp.com",
  projectId: "rss-feed-cb7c4",
  storageBucket: "rss-feed-cb7c4.firebasestorage.app",
  messagingSenderId: "692373422814",
  appId: "1:692373422814:web:1414d681ad757f8eee784f",
  measurementId: "G-6K3WX8CCML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);