import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6h1MxIyYsifSu3oiAhJc30mwZpMTcTg8",
  authDomain: "collectu-140c9.firebaseapp.com",
  projectId: "collectu-140c9",
  storageBucket: "collectu-140c9.firebasestorage.app",
  messagingSenderId: "510587086112",
  appId: "1:510587086112:web:5f45e73535f90e08a0a345",
  measurementId: "G-4XLYPC7NYB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
