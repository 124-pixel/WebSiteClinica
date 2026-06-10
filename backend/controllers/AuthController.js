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
}

module.exports = new AuthController();