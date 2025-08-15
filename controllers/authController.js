import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  getDoc,
  doc,
  db,
  setDoc,
  serverTimestamp
} from '../config/firebaseConfig.js';
import { checkAdmin} from "../services/authService.js";

export const renderLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

// Modificar la función loginUser para incluir isAdmin en la sesión
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const isAdmin = await checkAdmin(userCredential.user.uid);
    
    req.session.user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      isAdmin: isAdmin
    };
    
    res.redirect('/');
  } catch (error) {
    res.render('auth/login', { error: 'Credenciales inválidas' });
  }
};

export const renderRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      role:'user',
      uid: userCredential.user.uid,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });

    req.session.user = {
      uid: userCredential.user.uid,
      email: userCredential.user.email
    };
    res.redirect('/');
  } catch (error) {
    res.render('auth/register', { error: error.message });
  }
};

export const logoutUser = (req, res) => {
  signOut(auth).then(() => {
    req.session.destroy();
    res.redirect('/auth/login');
  });
};

