import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUayM0gkw0troeabxD6a8zJ1eYhxmcpo4",
  authDomain: "mycabinet-1bb9c.firebaseapp.com",
  projectId: "mycabinet-1bb9c",
  storageBucket: "mycabinet-1bb9c.firebasestorage.app",
  messagingSenderId: "86361018325",
  appId: "1:86361018325:web:b1bf9c7df062d6c37e775c",
  measurementId: "G-D47SQ5QDZZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;