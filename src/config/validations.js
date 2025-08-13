export const validateCSVData = (data) => {
  const errors = [];
  
  // Validación básica de ejemplo - personaliza según tus necesidades
  data.forEach((row, index) => {
    /*if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push(`Fila ${index + 1}: Email inválido o faltante`);
    }*/
    
    if (row.age && isNaN(parseInt(row.age))) {
      errors.push(`Fila ${index + 1}: Edad debe ser un número`);
    }
    
    // Añade más validaciones según tus requisitos
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFile = (file) => {
  if (!file) return { isValid: false, error: 'No se ha subido ningún archivo' };
  if (file.mimetype !== 'text/csv') return { isValid: false, error: 'El archivo debe ser CSV' };
  if (file.size > 5 * 1024 * 1024) return { isValid: false, error: 'El archivo no puede exceder 5MB' };
  
  return { isValid: true, error: null };
};