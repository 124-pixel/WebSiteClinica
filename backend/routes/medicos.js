const express = require('express');
const router  = express.Router();
const { getMedicosPorEspecialidad, getHorariosOcupados } = require('../controllers/MedicosController');

router.get('/',              getMedicosPorEspecialidad); // GET /api/medicos?especialidad=cardiologia
router.get('/:id/horarios',  getHorariosOcupados);       // GET /api/medicos/:id/horarios?fecha=

module.exports = router;