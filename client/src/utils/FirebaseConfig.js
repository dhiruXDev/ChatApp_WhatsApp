// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBjjTXO-wcVuo9OsSC2afcO2NEpq-mS29g",
    authDomain: "whatsapp-clone-e9b46.firebaseapp.com",
    projectId: "whatsapp-clone-e9b46",
    storageBucket: "whatsapp-clone-e9b46.firebasestorage.app",
    messagingSenderId: "622863397418",
    appId: "1:622863397418:web:e112c3f7f1b7cb79d90953",
    measurementId: "G-812RVGHX74"
  };


const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);