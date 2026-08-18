/**
 * middlewares/manejadorErrores.js
 * ------------------------------------------------------------
 * Middleware centralizado de manejo de errores.
 * Express detecta este middleware porque tiene 4 parametros
 * (err, req, res, next). Aqui se atrapan tanto los errores de
 * negocio (ErrorAutenticacion) como errores inesperados, para
 * que nunca se le devuelva al cliente un stack trace ni el
 * servidor se caiga sin responder nada.
 * ------------------------------------------------------------
 */

function manejadorErrores(err, req, res, next) {
  console.error('Error capturado:', err.message);

  // Errores de negocio conocidos (ya traen su propio codigo HTTP)
  const codigoHttp = err.codigoHttp || 500;

  const mensajePublico = codigoHttp === 500
    ? 'Ocurrio un error interno en el servidor.'
    : err.message;

  res.status(codigoHttp).json({
    exito: false,
    mensaje: mensajePublico
  });
}

module.exports = manejadorErrores;
