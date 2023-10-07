// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDY2eTg2QnV4PFWuW3zr_XisAg3sVTfxLA",
  authDomain: "chating-36960.firebaseapp.com",
  projectId: "chating-36960",
  storageBucket: "chating-36960.appspot.com",
  messagingSenderId: "787682261538",
  appId: "1:787682261538:web:76022df3ad59a3f51b687b",
  measurementId: "G-XCGWB72TKN",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();


// 477904204925-rr8n5mu0mvk2auscmh73jtm1teblo4bl.apps.googleusercontent.com
// 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