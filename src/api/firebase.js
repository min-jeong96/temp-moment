import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwaSdt0jnERoYlWybRNOdBKOoaF_a9MXQ",
  authDomain: "temp-moment.firebaseapp.com",
  projectId: "temp-moment",
  storageBucket: "temp-moment.appspot.com",
  messagingSenderId: "655905958144",
  appId: "1:655905958144:web:dea372431399a8c3022be5",
  measurementId: "G-8RQGZC2KGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export { app };