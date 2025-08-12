/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");

const __filename = fileURLToPath( require(import.meta.url));
const __dirname = path.dirname(__filename);

// Configurar Handlebars
app.engine("handlebars", exphbs.engine());
// app.set("view engine", "handlebars");
// app.set("views", "/views");

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta dinámica
app.get("/hello", (req, res) => {
  res.render("hello", {name: "Firebase Developer"});
});

// Define tus rutas
app.get("/", (req, res) => {
  res.send("¡Hola desde Express en Firebase Functions!");
});

app.get("/saludo", (req, res) => {
  res.json({mensaje: "¡Hola, mundo!"});
});

// Exporta la app de Express como una función de Firebase
exports.api = functions.https.onRequest(app);

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
