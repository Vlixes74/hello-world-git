import { 
   getDoc,
  doc,
  db,
  } from '../config/firebaseConfig.js';

export const checkAdmin = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};