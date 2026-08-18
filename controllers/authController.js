/**
 * controllers/authController.js
 * ------------------------------------------------------------
 * Capa de controladores: recibe la peticion HTTP (req), extrae
 * los datos, llama a la capa de servicios y arma la respuesta
 * (res). No contiene logica de negocio ni consultas SQL.
 * ------------------------------------------------------------
 */

const authService = require('../services/authService');

/**
 * POST /api/auth/register
 * Registra un nuevo usuario del sistema de biblioteca.
 */
async function register(req, res, next) {
  try {
    const { nombreUsuario, correo, contrasena } = req.body;

    const usuarioCreado = await authService.registrarUsuario({
      nombreUsuario,
      correo,
      contrasena
    });

    // 201 Created: el recurso "usuario" fue creado exitosamente
    return res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente.',
      usuario: usuarioCreado
    });
  } catch (error) {
    // Se delega el error al middleware centralizado (next(error))
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Valida las credenciales de un usuario e inicia sesion.
 */
async function login(req, res, next) {
  try {
    const { nombreUsuario, contrasena } = req.body;

    const resultado = await authService.iniciarSesion({ nombreUsuario, contrasena });

    // 200 OK: autenticacion satisfactoria
    return res.status(200).json({
      exito: true,
      mensaje: 'Autenticacion satisfactoria.',
      token: resultado.token,
      usuario: resultado.usuario
    });
  } catch (error) {
    // Si es un error de credenciales invalidas, el middleware de errores
    // respondera automaticamente con el codigo 401 y el mensaje adecuado
    next(error);
  }
}

module.exports = { register, login };
