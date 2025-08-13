const express = require('express');
const path = require('path');
const app = express();

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/ejs'));

// Configuración de Handlebars
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views/hbs'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/ejs', (req, res) => {
  res.render('index', { title: 'Página con EJS', message: 'Hola desde EJS!' });
});
// Define tus rutas
app.get("/", (req, res) => {
  res.send("¡Hola desde Express en Firebase !");
});
app.get('/hbs', (req, res) => {
  res.render('index', { layout: false, title: 'Página con Handlebars', message: 'Hola desde Handlebars!' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
