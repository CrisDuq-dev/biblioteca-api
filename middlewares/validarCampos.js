/**
 * middlewares/validarCampos.js
 * ------------------------------------------------------------
 * Middlewares para validar los datos recibidos ANTES de que
 * lleguen al controller. Esto evita procesar peticiones
 * incompletas o mal formadas (control de errores de entrada).
 * ------------------------------------------------------------
 */

/**
 * Valida los campos requeridos para el registro de usuario.
 */
function validarRegistro(req, res, next) {
  const { nombreUsuario, correo, contrasena } = req.body;
  const errores = [];

  if (!nombreUsuario || typeof nombreUsuario !== 'string' || nombreUsuario.trim().length < 3) {
    errores.push('El nombre de usuario es obligatorio y debe tener al menos 3 caracteres.');
  }

  // Validacion simple de formato de correo con expresion regular
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correo || !regexCorreo.test(correo)) {
    errores.push('Debe proporcionar un correo electronico valido.');
  }

  if (!contrasena || typeof contrasena !== 'string' || contrasena.length < 6) {
    errores.push('La contrasena es obligatoria y debe tener al menos 6 caracteres.');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Datos de registro invalidos.',
      errores
    });
  }

  next(); // los datos son validos, continua al controller
}

/**
 * Valida los campos requeridos para el inicio de sesion.
 */
function validarLogin(req, res, next) {
  const { nombreUsuario, contrasena } = req.body;
  const errores = [];

  if (!nombreUsuario || typeof nombreUsuario !== 'string') {
    errores.push('El nombre de usuario es obligatorio.');
  }

  if (!contrasena || typeof contrasena !== 'string') {
    errores.push('La contrasena es obligatoria.');
  }

  if (errores.length > 0) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error en la autenticacion: datos incompletos.',
      errores
    });
  }

  next();
}

module.exports = { validarRegistro, validarLogin };
