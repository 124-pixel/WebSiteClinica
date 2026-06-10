/**
 * SERVICE - Capa de lógica de negocio
 * Contiene las reglas del negocio para autenticación
 * Usa el DAO para acceder a los datos
 */
const jwt        = require('jsonwebtoken');
const UsuarioDAO = require('../dao/UsuarioDAO');
const UsuarioDTO = require('../models/UsuarioDTO');

const SECRET     = 'clinica_secret_2024';
const TOKEN_EXP  = '8h';

class AuthService {

  // Login de usuario
  async login(correo, contrasena) {

    // 1. Buscar usuario en la BD
    const usuario = await UsuarioDAO.findByCorreo(correo);
    if (!usuario) {
      throw { status: 401, message: 'Correo o contraseña incorrectos.' };
    }

    // 2. Verificar estado
    if (usuario.estado && usuario.estado !== 'activo') {
      throw { status: 403, message: 'Tu cuenta está inactiva. Contacta al administrador.' };
    }

    // 3. Verificar contraseña (texto plano por ahora)
    const passwordValida = contrasena === usuario.contrasena;
    if (!passwordValida) {
      throw { status: 401, message: 'Correo o contraseña incorrectos.' };
    }

    // 4. Crear DTO sin la contraseña
    const usuarioDTO = new UsuarioDTO({
      id:             usuario.id,
      nombre:         usuario.nombre,
      correo:         usuario.correo,
      telefono:       usuario.telefono,
      id_rol:         usuario.id_rol,
      nombre_rol:     usuario.nombre_rol,
      fecha_registro: usuario.fecha_registro,
      estado:         usuario.estado,
    });

    // 5. Generar token JWT
    const token = jwt.sign(
      { id: usuarioDTO.id, nombre: usuarioDTO.nombre, rol: usuarioDTO.nombre_rol },
      SECRET,
      { expiresIn: TOKEN_EXP }
    );

    return { token, usuario: usuarioDTO };
  }

  // Verificar token
  verificarToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch {
      throw { status: 401, message: 'Token inválido o expirado.' };
    }
  }
}

module.exports = new AuthService();