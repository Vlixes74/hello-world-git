// controllers/adminController.js

import { db, collection, getDocs, writeBatch, serverTimestamp,addDoc,doc } from '../config/firebaseConfig.js';
import { checkAdmin} from "../services/authService.js";
import {  getUserUploads} from "./uploadController.js";

export const deleteCollection = async (req, res) => {
  const { collectionName } = req.params;
  
  try {
    // Verificar que la colección está permitida para borrado
    const allowedCollections = ['CodigoQr'];
    if (!allowedCollections.includes(collectionName)) {
      return res.status(400).render('error', { error: 'Colección no permitida para borrado' });
    }
    const querySnapshot = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);
    
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    // Registrar la acción administrativa
    await addDoc(collection(db, 'adminActions'), {
      action: 'deleteCollection',
      targetCollection: collectionName,
      deletedCount: querySnapshot.size,
      performedBy: req.session.user.uid,
      performedAt: serverTimestamp()
    });
    
        res.render('index', {
      data: null,
      error: null,
      success: `Se eliminaron ${querySnapshot.size} documentos de la colección cities.`,
      uploads: await getUserUploads(req.session.user.uid)
    });

   // req.session.success = `Se eliminaron ${querySnapshot.size} documentos de la colección ${collectionName}`;
    //res.redirect('/');
    
  } catch (error) {
    console.error("Delete collection error:", error);
    res.status(500).render('error', { error: 'Error al eliminar la colección' });
  }
};
// Añadir este nuevo método al controlador
export const deleteCities = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');

  try {
    // Obtener todas las ciudades
    const citiesRef = collection(db, 'cities');
    const querySnapshot = await getDocs(citiesRef);
    
    // Crear batch para eliminación masiva
    const batch = writeBatch(db);
    
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Ejecutar el batch
    await batch.commit();
    
    // Registrar la acción en el historial
    await addDoc(collection(db, 'adminActions'), {
      userId: req.session.user.uid,
      action: 'massDelete',
      targetCollection: 'cities',
      deletedCount: querySnapshot.size,
      performedAt: serverTimestamp()
    });
    
    res.render('index', {
      data: null,
      error: null,
      success: `Se eliminaron ${querySnapshot.size} documentos de la colección cities.`,
      uploads: await getUserUploads(req.session.user.uid)
    });
    
  } catch (error) {
    res.render('index', {
      data: null,
      error: `Error al eliminar ciudades: ${error.message}`,
      success: null,
      uploads: await getUserUploads(req.session.user.uid)
    });
  }
};

// Versión con límite y paginación
export const deleteCitiesBatch = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');

  const limit = 500; // Límite de documentos por operación
  let deletedCount = 0;

  try {
    let querySnapshot;
    do {
      const citiesRef = collection(db, 'cities');
      const q = query(citiesRef, limit(limit));
      querySnapshot = await getDocs(q);
      
      if (querySnapshot.size > 0) {
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        deletedCount += querySnapshot.size;
      }
    } while (querySnapshot.size > 0);
    
    await addDoc(collection(db, 'adminActions'), {
      userId: req.session.user.uid,
      action: 'massDelete',
      targetCollection: 'cities',
      deletedCount,
      performedAt: serverTimestamp()
    });
    
    res.render('index', {
      data: null,
      error: null,
      success: `Se eliminaron ${deletedCount} documentos de la colección cities.`,
      uploads: await getUserUploads(req.session.user.uid)
    });
    
  } catch (error) {
    res.render('index', {
      data: null,
      error: `Error al eliminar ciudades: ${error.message}`,
      success: null,
      uploads: await getUserUploads(req.session.user.uid)
    });
  }
};
