import express from 'express';
import { 
  renderLogin, 
  loginUser, 
  renderRegister, 
  registerUser, 
  logoutUser 
} from '../controllers/authController.js';
import { isAuthenticated, isNotAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/login', isNotAuthenticated, renderLogin);
router.post('/login', isNotAuthenticated, loginUser);
router.get('/register', isNotAuthenticated, renderRegister);
router.post('/register', isNotAuthenticated, registerUser);
router.get('/logout', isAuthenticated, logoutUser);

export default router;