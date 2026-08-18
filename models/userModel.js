/**
 * models/userModel.js
 * ------------------------------------------------------------
 * Capa de acceso a datos (modelo) para la tabla "usuarios".
 * Aqui solo va logica de consultas SQL, sin reglas de negocio.
 * Todas las consultas usan parametros preparados (?) para evitar
 * inyeccion SQL.
 * ------------------------------------------------------------
 */

const { pool } = require('../config/db');

/**
 * Busca un usuario por su nombre de usuario.
 * @param {string} nombreUsuario
 * @returns {Promise<object|null>} el usuario encontrado o null si no existe
 */
async function buscarPorNombreUsuario(nombreUsuario) {
  const [filas] = await pool.query(
    'SELECT id, nombre_usuario, correo, contrasena_hash FROM usuarios WHERE nombre_usuario = ? LIMIT 1',
    [nombreUsuario]
  );
  return filas.length > 0 ? filas[0] : null;
}

/**
 * Busca un usuario por su correo electronico.
 * Se usa para evitar correos duplicados al registrar.
 * @param {string} correo
 * @returns {Promise<object|null>}
 */
async function buscarPorCorreo(correo) {
  const [filas] = await pool.query(
    'SELECT id FROM usuarios WHERE correo = ? LIMIT 1',
    [correo]
  );
  return filas.length > 0 ? filas[0] : null;
}

/**
 * Inserta un nuevo usuario en la base de datos.
 * @param {{nombreUsuario: string, correo: string, contrasenaHash: string}} datos
 * @returns {Promise<number>} el id autogenerado del nuevo usuario
 */
async function crearUsuario({ nombreUsuario, correo, contrasenaHash }) {
  const [resultado] = await pool.query(
    'INSERT INTO usuarios (nombre_usuario, correo, contrasena_hash) VALUES (?, ?, ?)',
    [nombreUsuario, correo, contrasenaHash]
  );
  return resultado.insertId;
}

module.exports = {
  buscarPorNombreUsuario,
  buscarPorCorreo,
  crearUsuario
};
