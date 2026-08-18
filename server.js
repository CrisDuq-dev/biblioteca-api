/**
 * server.js
 * ------------------------------------------------------------
 * Punto de entrada de la aplicacion. Configura Express, monta
 * las rutas y levanta el servidor HTTP.
 *
 * Proyecto: Sistema de prestamo de libros (Biblioteca) - API REST
 * Evidencia: GA7-220501096-AA5-EV01
 * ------------------------------------------------------------
 */

require('dotenv').config();
const express = require('express');

const { verificarConexion } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const manejadorErrores = require('./middlewares/manejadorErrores');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());

// Ruta de verificacion rapida de que la API esta arriba
app.get('/', (req, res) => {
  res.status(200).json({
    exito: true,
    mensaje: 'API de la Biblioteca funcionando correctamente.'
  });
});

// Se montan los endpoints de autenticacion bajo el prefijo /api/auth
app.use('/api/auth', authRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada.'
  });
});

// Middleware global de manejo de errores (siempre al final)
app.use(manejadorErrores);

// Se verifica la conexion a la BD antes de levantar el servidor
verificarConexion().then(() => {
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
});
