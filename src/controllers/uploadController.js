import { 
  db, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  writeBatch,
  doc 
} from '../config/firebaseConfig.js';
import { validateCSVData, validateFile } from '../config/validations.js';
import fs from 'fs';
import csv from 'csv-parser';


export const renderUploadForm = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  
  try {
    // Obtener historial de cargas del usuario
    const q = query(
      collection(db, 'uploads'),
      where('userId', '==', req.session.user.uid)
    );
      const currentPage = parseInt(req.query.page) || 1;
    
    const querySnapshot = await getDocs(q);
    const uploads = [];
    
    querySnapshot.forEach((doc) => {
      uploads.push({
      id: doc.id,
      ...doc.data()
      });
    });
    
    res.render('index', {
      data: null, 
      error: null,
      success: null,
      uploads: uploads.sort((a, b) => b.uploadedAt - a.uploadedAt)
    });
    
  } catch (error) {
    res.render('index', {
      data: null,
      error: error.message,
      success: null,
      uploads: []
    });
  }
};

export const processUpload = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  
  const fileValidation = validateFile(req.file);
  if (!fileValidation.isValid) {
    return res.render('index', {
      data: null,
      error: fileValidation.error,
      success: null,
      uploads: []
    });
  }
  
  try {
    const results = [];
    const filePath = req.file.path;
    
    // Parsear CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
    
    // Validar datos
    const dataValidation = validateCSVData(results);
    if (!dataValidation.isValid) {
      fs.unlinkSync(filePath);
      return res.render('index', {
        data: null,
        error: `Errores de validación: ${dataValidation.errors.join(', ')}`,
        success: null,
        uploads: []
      });
    }
 const BATCH_LIMIT = 500; // Límite de Firestore

    // Guardar datos en Firestore
    const batchId = Date.now().toString();
for (let i = 0; i < results.length; i += BATCH_LIMIT) {
  const batch = writeBatch(db);
  const chunk = results.slice(i, i + BATCH_LIMIT);
  
  chunk.forEach((record) => {
    const docRef = doc(collection(db, 'CodigoQr'));
    batch.set(docRef, {
      ...record,
      userId: req.session.user.uid,
      batchId,
      uploadedAt: serverTimestamp()
    });
  });

  try {
    await batch.commit();
    console.log(`Batch ${i/BATCH_LIMIT + 1} completado (${chunk.length} docs)`);
  } catch (error) {
    console.error(`Error en batch ${i/BATCH_LIMIT + 1}:`, error);
    throw new Error(`Error al guardar lote ${i/BATCH_LIMIT + 1}`);
  }
}
    /*
    const savePromises = results.map(async (record) => {
      await addDoc(collection(db, 'CodigoQr'), {
        ...record,
        userId: req.session.user.uid,
        batchId,
        uploadedAt: serverTimestamp()
      });
    });*/
   
    // Registrar la carga
    
    await addDoc(collection(db, 'uploads'), {
      userId: req.session.user.uid,
      fileName: req.file.originalname,
      recordCount: results.length,
      batchId,
      uploadedAt: serverTimestamp()
    });

        fs.unlinkSync(filePath);
    
    res.render('index', {
      data: results.slice(0, 50), // Mostrar solo 10 registros como vista previa
      error: null,
      success: `Archivo procesado correctamente. ${results.length} registros guardados.`,
      uploads: await getUserUploads(req.session.user.uid)
    });
    
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.render('index', {
      data: null,
      error: `Error al procesar el archivo: ${error.message}`,
      success: null,
      uploads: await getUserUploads(req.session.user.uid)
    });
  }
};

export async function getUserUploads(userId) {
  const q = query(
    collection(db, 'uploads'),
    where('userId', '==', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const uploads = [];
  
  querySnapshot.forEach((doc) => {
    uploads.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return uploads.sort((a, b) => b.uploadedAt - a.uploadedAt);
}
