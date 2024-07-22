import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, initializeFirestore } from "firebase/firestore";

// Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyAGyV6TABw18h21JBorOj6L1rSE8sS305Q",
  authDomain: "testing-1a198.firebaseapp.com",
  projectId: "testing-1a198",
  storageBucket: "testing-1a198.appspot.com",
  messagingSenderId: "568714084213",
  appId: "1:568714084213:web:17835b23875f0ff91b5d3c",
};

const app = initializeApp(firebaseConfig);

// const db = getFirestore(app); //Chainging to below

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
const storage = getStorage(app);

export { db, storage };

export const initializeFirebase = () => {
  return app;
};

// error FirebaseError: Failed to get document because the client is offline.
