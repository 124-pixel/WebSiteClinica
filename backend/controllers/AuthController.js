/**
 * CONTROLLER - Capa de control
 * Maneja los requests HTTP y respuestas
 * Delega la lógica al Service
 */
const AuthService = require('../services/AuthService');

class AuthController {

  // POST /api/login
  async login(req, res) {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    }
    try {
      const result = await AuthService.login(correo, contrasena);
      res.json({
        mensaje: 'Login exitoso',
        token:   result.token,
        usuario: result.usuario,
      });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor.' });
    }
  }

  // POST /api/login-medico
  async loginMedico(req, res) {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    }
    try {
      const result = await AuthService.loginMedico(correo, contrasena);
      res.json({
        mensaje: 'Login exitoso',
        token:   result.token,
        usuario: result.usuario,
      });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor.' });
    }
  }

  // GET /api/perfil  (ruta protegida)
  async perfil(req, res) {
    try {
      const auth  = req.headers['authorization'];
      if (!auth) return res.status(401).json({ error: 'Token requerido.' });
      const token   = auth.split(' ')[1];
      const payload = AuthService.verificarToken(token);
      res.json({ usuario: payload });
    } catch (err) {
      res.status(err.status || 401).json({ error: err.message });
    }
  }

  // POST /api/usuarios/pacientes (Creado por el Admin)
  async registrarPaciente(req, res) {
    const { nombre, apellido, dni, correo, contrasena, telefono } = req.body;
    if (!nombre || !apellido || !dni || !correo || !contrasena) {
      return res.status(400).json({ error: 'Nombre, apellido, DNI, correo y contraseña son requeridos.' });
    }
    try {
      const UsuarioDAO = require('../dao/UsuarioDAO');

      let nuevoId;
      if (typeof UsuarioDAO.createPaciente === 'function') {
        nuevoId = await UsuarioDAO.createPaciente({ nombre, apellido, dni, correo, contrasena, telefono });
      } else {
        const daoInstancia = new UsuarioDAO();
        nuevoId = await daoInstancia.createPaciente({ nombre, apellido, dni, correo, contrasena, telefono });
      }
      res.status(201).json({
        mensaje: 'Paciente registrado exitosamente',
        usuarioId: nuevoId
      });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || 'Error al registrar al paciente.' });
    }
  }

  // GET /api/usuarios/pacientes (Listar en la tabla)
  async obtenerPacientes(req, res) {
    try {
      const UsuarioDAO = require('../dao/UsuarioDAO');

      let pacientes;
      if (typeof UsuarioDAO.getPacientes === 'function') {
        pacientes = await UsuarioDAO.getPacientes();
      } else {
        const daoInstancia = new UsuarioDAO();
        pacientes = await daoInstancia.getPacientes();
      }
      res.json({
        ok: true,
        pacientes: pacientes || []
      });
    } catch (err) {
      console.error('Error al obtener pacientes:', err.message);
      res.status(500).json({ error: 'Error al obtener la lista de pacientes.' });
    }
  }
}

// Exportación mapeada estricta para evitar pérdidas de contexto
module.exports = {
  login:              (req, res) => new AuthController().login(req, res),
  loginMedico:        (req, res) => new AuthController().loginMedico(req, res),
  perfil:             (req, res) => new AuthController().perfil(req, res),
  registrarPaciente:  (req, res) => new AuthController().registrarPaciente(req, res),
  obtenerPacientes:   (req, res) => new AuthController().obtenerPacientes(req, res)
};