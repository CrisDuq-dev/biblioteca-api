/**
 * routes/authRoutes.js
 * ------------------------------------------------------------
 * Define los endpoints relacionados con autenticacion y conecta
 * cada ruta con su middleware de validacion y su controller.
 * ------------------------------------------------------------
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validarRegistro, validarLogin } = require('../middlewares/validarCampos');

// POST /api/auth/register -> Registrar un nuevo usuario
router.post('/register', validarRegistro, authController.register);

// POST /api/auth/login -> Iniciar sesion (validar usuario y contrasena)
router.post('/login', validarLogin, authController.login);

module.exports = router;
