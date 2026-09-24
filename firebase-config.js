import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvQ0HSPiZCZxpNw9qQaNpN7gv7emmUc9A",
  authDomain: "wavi-mindchive.firebaseapp.com",
  projectId: "wavi-mindchive",
  storageBucket: "wavi-mindchive.firebasestorage.app",
  messagingSenderId: "984278671936",
  appId: "1:984278671936:web:93964300ef8a09e3a835a5",
  measurementId: "G-87WZ85DPBY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
};