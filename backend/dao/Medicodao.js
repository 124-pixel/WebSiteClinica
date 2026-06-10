const { sql, poolPromise } = require('../config/db');

class MedicoDAO {

  async getEspecialidades() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT DISTINCT especialidad AS nombre
        FROM dbo.medicos
        WHERE estado = 'Activo'
        AND especialidad IS NOT NULL
        ORDER BY especialidad ASC
      `);
    return result.recordset;
  }

  async getMedicosByEspecialidad(especialidad) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('especialidad', sql.VarChar, especialidad)
      .query(`
        SELECT
          id, nombre, apellido, especialidad,
          CONCAT('Dr. ', nombre, ' ', apellido) AS nombreCompleto
        FROM dbo.medicos
        WHERE especialidad = @especialidad
          AND estado = 'Activo'
        ORDER BY apellido ASC
      `);
    return result.recordset;
  }

  async getAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT
          id, nombre, apellido, especialidad,
          CONCAT('Dr. ', nombre, ' ', apellido) AS nombreCompleto
        FROM dbo.medicos
        WHERE estado = 'Activo'
        ORDER BY especialidad, apellido ASC
      `);
    return result.recordset;
  }

  async getHorariosOcupados(id_medico, fecha) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_medico', sql.Int,  id_medico)
      .input('fecha',     sql.Date, fecha)
      .query(`
        SELECT CONVERT(varchar(5), hora, 108) AS hora
        FROM dbo.citas
        WHERE id_medico = @id_medico
          AND fecha     = @fecha
          AND estado NOT IN ('cancelada')
      `);
    return result.recordset.map(r => r.hora);
  }
}

module.exports = new MedicoDAO();