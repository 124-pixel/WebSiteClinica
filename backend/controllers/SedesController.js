/**
 * Controller de Sedes
 */
const { sql, poolPromise } = require('../config/Db');

async function getSedes(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT id, nombre, direccion, telefono
        FROM dbo.sedes
        ORDER BY nombre ASC
      `);
    res.json({ ok: true, sedes: result.recordset });
  } catch (err) {
    console.error('[SedesController] getSedes:', err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener sedes' });
  }
}

module.exports = { getSedes };