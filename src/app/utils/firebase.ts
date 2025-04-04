// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxQAnGFPBYommiFkVNr88ajJKR0-m20nI",
    authDomain: "my-ai-therapy.firebaseapp.com",
    projectId: "my-ai-therapy",
    storageBucket: "my-ai-therapy.firebasestorage.app",
    messagingSenderId: "184329107691",
    appId: "1:184329107691:web:aeb4755745747d947ce6ae",
    measurementId: "G-VPPN6B3WHE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);