

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYYA413KCI6bm9CaGCFwZDmk-AszhUBuU",
  authDomain: "aisaas-683bc.firebaseapp.com",
  projectId: "aisaas-683bc",
  storageBucket: "aisaas-683bc.firebasestorage.app",
  messagingSenderId: "440057465654",
  appId: "1:440057465654:web:148e13716164015b04c197",
  measurementId: "G-NZZ4PN0HMM"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
