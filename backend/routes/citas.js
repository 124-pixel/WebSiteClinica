const express = require('express');
const router  = express.Router();
const {
  getCitasHoy,
  getCitas,
  getCitasPaciente,
  crearCita,
  actualizarEstado
} = require('../controllers/CitasController');


// ── Admin ──────────────────────────────────────────────────────
router.get('/hoy',                getCitasHoy);       // GET  /api/citas/hoy
router.get('/',                   getCitas);           // GET  /api/citas
router.patch('/:id/estado',       actualizarEstado);  // PATCH /api/citas/:id/estado

// ── Paciente ───────────────────────────────────────────────────
router.get('/paciente/:id_usuario', getCitasPaciente); // GET  /api/citas/paciente/:id
router.post('/',                    crearCita);         // POST /api/citas

module.exports = router;