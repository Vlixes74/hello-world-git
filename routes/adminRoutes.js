// routes/adminRoutes.js

import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';
import { deleteCollection } from '../controllers/adminController.js';

const router = express.Router();

router.post('/delete-collection/:collectionName',isAdmin, isAuthenticated, deleteCollection);

export default router;