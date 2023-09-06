// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfHfryy9AWL6HeM__JPgqJ6k7MB0Kr87E",
  authDomain: "timetracker-445e0.firebaseapp.com",
  projectId: "timetracker-445e0",
  storageBucket: "timetracker-445e0.appspot.com",
  messagingSenderId: "40312750127",
  appId: "1:40312750127:web:d5dfcbf9dffbac5ebb46da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);