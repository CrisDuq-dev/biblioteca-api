/**
 * services/authService.js
 * ------------------------------------------------------------
 * Capa de servicios (logica de negocio). Aqui se decide COMO se
 * registra un usuario y COMO se valida un inicio de sesion.
 * El controller solo llama a estas funciones, no sabe de SQL
 * ni de bcrypt/jwt directamente. Esto separa responsabilidades
 * (principio de responsabilidad unica).
 * ------------------------------------------------------------
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Clase de error personalizada para errores de negocio "esperados"
 * (ej: usuario ya existe, credenciales invalidas). Permite que el
 * controller sepa que codigo HTTP responder sin usar strings magicos.
 */
class ErrorAutenticacion extends Error {
  constructor(mensaje, codigoHttp) {
    super(mensaje);
    this.name = 'ErrorAutenticacion';
    this.codigoHttp = codigoHttp;
  }
}

/**
 * Registra un nuevo usuario en el sistema.
 * - Verifica que el nombre de usuario y el correo no existan ya.
 * - Hashea la contrasena antes de guardarla (NUNCA texto plano).
 *
 * @param {{nombreUsuario: string, correo: string, contrasena: string}} datos
 * @returns {Promise<{id: number, nombreUsuario: string, correo: string}>}
 */
async function registrarUsuario({ nombreUsuario, correo, contrasena }) {
  const usuarioExistente = await userModel.buscarPorNombreUsuario(nombreUsuario);
  if (usuarioExistente) {
    throw new ErrorAutenticacion('El nombre de usuario ya esta registrado.', 409);
  }

  const correoExistente = await userModel.buscarPorCorreo(correo);
  if (correoExistente) {
    throw new ErrorAutenticacion('El correo ya esta registrado.', 409);
  }

  // Se hashea la contrasena con bcrypt antes de persistirla
  const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

  const nuevoId = await userModel.crearUsuario({
    nombreUsuario,
    correo,
    contrasenaHash
  });

  return { id: nuevoId, nombreUsuario, correo };
}

/**
 * Valida el inicio de sesion de un usuario.
 * - Busca el usuario por nombre de usuario.
 * - Compara la contrasena recibida contra el hash guardado.
 * - Si es correcta, genera un token JWT para las siguientes peticiones.
 *
 * @param {{nombreUsuario: string, contrasena: string}} credenciales
 * @returns {Promise<{token: string, usuario: object}>}
 */
async function iniciarSesion({ nombreUsuario, contrasena }) {
  const usuario = await userModel.buscarPorNombreUsuario(nombreUsuario);

  // Importante: no se debe indicar si fallo el usuario o la contrasena
  // por separado, para no dar pistas a un atacante (evita "user enumeration").
  if (!usuario) {
    throw new ErrorAutenticacion('Error en la autenticacion: usuario o contrasena incorrectos.', 401);
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
  if (!contrasenaValida) {
    throw new ErrorAutenticacion('Error en la autenticacion: usuario o contrasena incorrectos.', 401);
  }

  const token = jwt.sign(
    { id: usuario.id, nombreUsuario: usuario.nombre_usuario },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombreUsuario: usuario.nombre_usuario,
      correo: usuario.correo
    }
  };
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  ErrorAutenticacion
};
