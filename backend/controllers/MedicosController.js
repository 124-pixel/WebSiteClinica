const medicoDAO = require('../dao/Medicodao');

async function getEspecialidades(req, res) {
  try {
    const especialidades = await medicoDAO.getEspecialidades();
    res.json({ ok: true, especialidades });
  } catch (err) {
    console.error('[MedicoController] getEspecialidades:', err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener especialidades' });
  }
}

async function getMedicos(req, res) {
  try {
    const { especialidad } = req.query;
    const medicos = especialidad
      ? await medicoDAO.getMedicosByEspecialidad(especialidad)
      : await medicoDAO.getAll();
    res.json({ ok: true, medicos });
  } catch (err) {
    console.error('[MedicoController] getMedicos:', err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener médicos' });
  }
}

async function getHorarios(req, res) {
  try {
    const id_medico = parseInt(req.params.id);
    const { fecha } = req.query;
    if (isNaN(id_medico))
      return res.status(400).json({ ok: false, mensaje: 'id de médico inválido' });
    if (!fecha)
      return res.status(400).json({ ok: false, mensaje: 'Parámetro fecha requerido (YYYY-MM-DD)' });
    const ocupados = await medicoDAO.getHorariosOcupados(id_medico, fecha);
    res.json({ ok: true, ocupados });
  } catch (err) {
    console.error('[MedicoController] getHorarios:', err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener horarios' });
  }
}

module.exports = { getEspecialidades, getMedicos, getHorarios };