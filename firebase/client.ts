
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1uPxSDDY9rljpf1xzPbwLB7zi3ulgAi0",
  authDomain: "prepwise-4c79f.firebaseapp.com",
  projectId: "prepwise-4c79f",
  storageBucket: "prepwise-4c79f.firebasestorage.app",
  messagingSenderId: "484036366165",
  appId: "1:484036366165:web:4773e9a6f569e44ff5a9dc",
  measurementId: "G-JR340X5XL2"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
