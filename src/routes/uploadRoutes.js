import express from 'express';
import multer from 'multer';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { renderUploadForm, processUpload} from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', isAuthenticated, renderUploadForm);
router.post('/upload', isAuthenticated, upload.single('csvFile'), processUpload);
// Añadir esta ruta al final del archivo
//router.post('/delete-cities', isAuthenticated, deleteCities);

export default router;