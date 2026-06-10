/**
 * CONTROLLER
 * Maneja los endpoints de citas, médicos y especialidades
 */
const CitaDAO   = require('../dao/Citadao');
const MedicoDAO = require('../dao/Medicodao');

class CitaController {

  // GET /api/especialidades
  async getEspecialidades(req, res) {
    try {
      const especialidades = await MedicoDAO.getEspecialidades();
      res.json({ ok: true, especialidades });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, mensaje: 'Error al obtener especialidades' });
    }
  }

  // GET /api/medicos?especialidad=Cardiología
  async getMedicos(req, res) {
    try {
      const { especialidad } = req.query;
      if (!especialidad) {
        const medicos = await MedicoDAO.getAll();
        return res.json({ ok: true, medicos });
      }
      const medicos = await MedicoDAO.getMedicosByEspecialidad(especialidad);
      res.json({ ok: true, medicos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, mensaje: 'Error al obtener médicos' });
    }
  }

  // GET /api/medicos/:id/horarios?fecha=2025-06-10
  async getHorarios(req, res) {
    try {
      const { id } = req.params;
      const { fecha } = req.query;
      if (!fecha) return res.status(400).json({ ok: false, mensaje: 'Fecha requerida' });
      const ocupados = await CitaDAO.getHorariosOcupados(parseInt(id), fecha);
      res.json({ ok: true, ocupados });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, mensaje: 'Error al obtener horarios' });
    }
  }

  // POST /api/citas
  async createCita(req, res) {
    try {
      const { id_usuario, id_medico, especialidad, fecha, hora, sede, tipo, motivo } = req.body;

      if (!id_usuario || !id_medico || !fecha || !hora) {
        return res.status(400).json({ ok: false, mensaje: 'Faltan datos requeridos' });
      }

      const id = await CitaDAO.create({ id_usuario, id_medico, especialidad, fecha, hora, sede, tipo, motivo });
      res.json({ ok: true, mensaje: 'Cita registrada correctamente', id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, mensaje: 'Error al registrar la cita' });
    }
  }

  // GET /api/citas/hoy  (para el admin)
  async getCitasHoy(req, res) {
    try {
      const citas = await CitaDAO.getCitasHoy();
      res.json({ ok: true, citas });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, mensaje: 'Error al obtener citas' });
    }
  }

  // GET /api/citas/usuario/:id
  async getCitasUsuario(req, res) {
    try {
      const { id } = req.params;
      const citas = await CitaDAO.getCitasByUsuario(parseInt(id));
      res.json({ ok: true, citas });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, mensaje: 'Error al obtener citas del usuario' });
    }
  }

  // PATCH /api/citas/:id/estado
  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      await CitaDAO.updateEstado(parseInt(id), estado);
      res.json({ ok: true, mensaje: 'Estado actualizado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, mensaje: 'Error al actualizar estado' });
    }
  }
}

module.exports = new CitaController();