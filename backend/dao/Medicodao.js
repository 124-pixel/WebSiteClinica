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
          m.id, 
          m.nombre, 
          m.apellido, 
          m.especialidad,
          m.correo,        -- ➡️ Agregamos el correo
          m.estado,        -- ➡️ Agregamos el estado (Activo/Inactivo)
          m.id_sede,       -- ➡️ Opcional por si lo necesitas
          s.nombre AS sede, -- ➡️ Traemos el nombre real de la sede haciendo el JOIN
          CONCAT(m.nombre, ' ', m.apellido) AS nombreCompleto
        FROM dbo.medicos m
        LEFT JOIN dbo.sedes s ON m.id_sede = s.id -- ➡️ Cruzamos con la tabla de sedes
        -- Quitamos el WHERE estado = 'Activo' para que el admin pueda ver TODOS los médicos (activos o no)
        ORDER BY m.especialidad, m.apellido ASC
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

  // Buscar médico por correo (para el login)
  async findByCorreo(correo) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query(`
        SELECT id, nombre, apellido, correo, contrasena, telefono, horario,
               estado, id_especialidad, id_sede, especialidad
        FROM dbo.medicos
        WHERE correo = @correo
      `);
    return result.recordset[0] || null;
  }
}

module.exports = new MedicoDAO();