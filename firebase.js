// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGRwxYt2MgZ8IxqGuolsGJ55yJfX2zt3k",
  authDomain: "medchain-d380c.firebaseapp.com",
  projectId: "medchain-d380c",
  storageBucket: "medchain-d380c.appspot.com",
  messagingSenderId: "986717976792",
  appId: "1:986717976792:web:a830ec9d83f07d9ee7ffad",
  measurementId: "G-H4HSSYHRLR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
