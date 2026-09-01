import { initializeApp } from "firebase/app";

const firebaseConfig = {
  projectId: "daily-reflection-app-143d9",
  appId: "1:973700760040:web:a86e87e14419b6c121645d",
  storageBucket: "daily-reflection-app-143d9.firebasestorage.app",
  apiKey: "AIzaSyBstvmAOMCH9WC33Q6U_KpT9v7jOg6M_Ks",
  authDomain: "daily-reflection-app-143d9.firebaseapp.com",
  messagingSenderId: "973700760040",
  measurementId: "G-RP31GX5MVQ"
};

export const app = initializeApp(firebaseConfig);
