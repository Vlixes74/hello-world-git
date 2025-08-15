import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  getDoc,
  doc,
  writeBatch,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBbin0_GG1PYaKrxkg0KVIbTV5awzTwMHo",
  authDomain: "pruebaweb-1b627.firebaseapp.com",
  projectId: "pruebaweb-1b627",
  storageBucket: "pruebaweb-1b627.firebasestorage.app",
  messagingSenderId: "598469342222",
  appId: "1:598469342222:web:d7f031aac8bb21c3cbb85f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { 
  db, 
  auth, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  getDoc,
  doc,
  serverTimestamp,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  writeBatch,
  setDoc
};