export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
};
// middlewares/authMiddleware.js
export const isAdmin = async (req, res, next) => {
  if (!req.session.user || req.session.user.isAdmin==null) {
    return res.redirect('/auth/login');
  }
  
  try {
   // const userDoc = req.session.user; //await getDoc(doc(db, 'users', req.session.user.uid));
    const isAdmin = req.session.user.isAdmin; // ;userDoc.exists() && userDoc.data().role === 'admin';
    
    if (isAdmin) {
     // req.session.user.isAdmin = true;
      return next();
    }
    
    res.status(403).render('error', { error: 'Acceso no autorizado' });
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).render('error', { error: 'Error interno del servidor' });
  }
};
