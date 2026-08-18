# API Biblioteca - Registro e Inicio de Sesión

Evidencia **GA7-220501096-AA5-EV01** — Diseño y desarrollo de servicios web.
Aprendiz: Cristian Camilo Duque Franco — Ficha 3235896 (ADSO) — Instructor: Edicson Niño Arévalo.

## ¿Qué es este servicio?

API REST que permite a los usuarios de un sistema de préstamo de libros (biblioteca)
**registrarse** e **iniciar sesión**. Si la autenticación es correcta responde con un
mensaje de autenticación satisfactoria y un token JWT; si no, responde con un error
de autenticación y el código HTTP correspondiente.

## Tecnologías

- Node.js + Express
- MySQL (mysql2)
- bcrypt (hash de contraseñas)
- jsonwebtoken (JWT)

## Estructura del proyecto

```
biblioteca-api/
├── config/         # Configuración de conexión a la base de datos
├── controllers/     # Reciben la petición HTTP y devuelven la respuesta
├── middlewares/      # Validación de datos y manejo de errores
├── models/           # Acceso a datos (consultas SQL)
├── routes/           # Definición de endpoints
├── services/         # Lógica de negocio (registro / login)
├── sql/schema.sql     # Script de creación de la base de datos
├── server.js          # Punto de entrada
└── .env.example        # Variables de entorno de ejemplo
```

## Instalación y ejecución

1. Clonar el repositorio e instalar dependencias:
   ```bash
   npm install
   ```

2. Crear la base de datos ejecutando `sql/schema.sql` en MySQL:
   ```bash
   mysql -u root -p < sql/schema.sql
   ```

3. Copiar `.env.example` a `.env` y completar los datos de tu MySQL local:
   ```bash
   cp .env.example .env
   ```

4. Levantar el servidor:
   ```bash
   npm start
   ```

   El servidor queda escuchando en `http://localhost:3000`.

## Endpoints

### `POST /api/auth/register`

Registra un nuevo usuario.

**Body (JSON):**
```json
{
  "nombreUsuario": "jperez",
  "correo": "jperez@correo.com",
  "contrasena": "miClaveSegura123"
}
```

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente.",
  "usuario": { "id": 1, "nombreUsuario": "jperez", "correo": "jperez@correo.com" }
}
```

### `POST /api/auth/login`

Valida las credenciales e inicia sesión.

**Body (JSON):**
```json
{
  "nombreUsuario": "jperez",
  "contrasena": "miClaveSegura123"
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Autenticacion satisfactoria.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": { "id": 1, "nombreUsuario": "jperez", "correo": "jperez@correo.com" }
}
```

**Respuesta de error (401 - credenciales incorrectas):**
```json
{
  "exito": false,
  "mensaje": "Error en la autenticacion: usuario o contrasena incorrectos."
}
```

## Manejo de errores

| Código | Caso |
|--------|------|
| 400 | Datos incompletos o mal formateados (falta usuario, correo inválido, contraseña muy corta) |
| 401 | Usuario o contraseña incorrectos al iniciar sesión |
| 409 | El nombre de usuario o el correo ya están registrados |
| 500 | Error interno inesperado del servidor |

## Seguridad implementada

- Contraseñas guardadas como **hash con bcrypt**, nunca en texto plano.
- Consultas SQL **parametrizadas** (previene inyección SQL).
- Mensajes de error de login genéricos (no revelan si falló el usuario o la contraseña).
- Token JWT con expiración configurable para futuras peticiones autenticadas.
