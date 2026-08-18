-- ============================================================
-- Base de datos: Sistema de prestamo de libros (Biblioteca)
-- Evidencia GA7-220501096-AA5-EV01
-- ============================================================

CREATE DATABASE IF NOT EXISTS biblioteca_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE biblioteca_db;

-- Tabla de usuarios del sistema (lectores/usuarios de la biblioteca)
-- La contrasena NUNCA se guarda en texto plano, solo su hash (bcrypt).
CREATE TABLE IF NOT EXISTS usuarios (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario  VARCHAR(50)  NOT NULL UNIQUE,
    correo          VARCHAR(120) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    fecha_creacion  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Indices adicionales para busquedas rapidas por login
CREATE INDEX idx_usuarios_nombre_usuario ON usuarios (nombre_usuario);
