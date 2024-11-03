import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB16tc9aHvPyzlHRW2mGsi9C4je9ICP3MA",
  authDomain: "bartercove-761fb.firebaseapp.com",
  projectId: "bartercove-761fb",
  storageBucket: "bartercove-761fb.firebasestorage.app",
  messagingSenderId: "445086944335",
  appId: "1:445086944335:web:c7104b3e8aab8e8f096e3a",
  measurementId: "G-FGK3EKNXP0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
