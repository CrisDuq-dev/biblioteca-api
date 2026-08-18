/**
 * config/db.js
 * ------------------------------------------------------------
 * Configura y expone el pool de conexiones a MySQL usando mysql2/promise.
 * Se usa un "pool" en lugar de una conexion unica para poder atender
 * varias peticiones concurrentes sin bloquear el servidor.
 * ------------------------------------------------------------
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // maximo de conexiones simultaneas en el pool
  queueLimit: 0
});

/**
 * Verifica que la conexion a la base de datos funcione correctamente.
 * Se llama una vez al iniciar el servidor para fallar rapido si la
 * configuracion de la BD esta mal (fail-fast).
 */
async function verificarConexion() {
  try {
    const conexion = await pool.getConnection();
    console.log('Conexion a MySQL establecida correctamente.');
    conexion.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1); // detenemos la app si no hay BD, no tiene sentido seguir
  }
}

module.exports = { pool, verificarConexion };
