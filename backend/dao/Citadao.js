/**
 * DAO — Data Access Object para Citas (Modificado para múltiples resultados en JSON)
 */
const { sql, poolPromise } = require('../config/db');

class CitaDAO {

  // GET /api/citas/hoy
  async getCitasHoy() {
    const pool = await poolPromise;
    const hoy  = new Date().toISOString().split('T')[0];
    const result = await pool.request()
      .input('hoy', sql.Date, hoy)
      .query(`
        SELECT
          c.id,
          CONVERT(varchar(5), c.hora, 108) AS hora,
          c.estado, c.especialidad, c.sede, c.tipo, c.motivo,
          u.nombre   AS paciente_nombre,
          u.apellido AS paciente_apellido,
          m.nombre   AS medico_nombre,
          m.apellido AS medico_apellido
        FROM dbo.citas c
        LEFT JOIN dbo.usuarios u ON u.id = c.id_usuario
        LEFT JOIN dbo.medicos  m ON m.id = c.id_medico
        WHERE c.fecha = @hoy
        ORDER BY c.hora ASC
      `);
    return result.recordset;
  }

  // GET /api/citas/usuario/:id
  async getCitasByUsuario(id_usuario) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_usuario', sql.Int, id_usuario)
      .query(`
        SELECT
          c.id,
          CONVERT(varchar(10), c.fecha, 23) AS fecha,
          CONVERT(varchar(5), c.hora, 108)  AS hora,
          c.estado, c.especialidad, c.sede, c.tipo, c.motivo, c.resultado, c.resultado_tipo,
          m.nombre   AS nombre_medico,
          m.apellido AS apellido_medico
        FROM dbo.citas c
        LEFT JOIN dbo.medicos m ON m.id = c.id_medico
        WHERE c.id_usuario = @id_usuario
        ORDER BY c.fecha DESC, c.hora ASC
      `);
    return result.recordset;
  }

  // GET /api/citas/medico/:id
  async getCitasByMedico(id_medico) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_medico', sql.Int, id_medico)
      .query(`
        SELECT
          c.id,
          CONVERT(varchar(10), c.fecha, 23) AS fecha,
          CONVERT(varchar(5), c.hora, 108)  AS hora,
          c.estado, c.especialidad, c.sede, c.tipo, c.motivo,
          c.resultado, c.resultado_tipo,
          u.id       AS id_paciente,
          u.nombre   AS nombre_paciente,
          u.apellido AS apellido_paciente,
          u.telefono AS telefono_paciente
        FROM dbo.citas c
        LEFT JOIN dbo.usuarios u ON u.id = c.id_usuario
        WHERE c.id_medico = @id_medico
        ORDER BY c.fecha ASC, c.hora ASC
      `);
    return result.recordset;
  }

  // PATCH /api/citas/:id/resultado (¡ACTUALIZADO!)
  // Ahora "resultado" será un String de un JSON Array conteniendo todos los elementos agregados.
  async updateResultado(id, resultado, resultado_tipo) {
    const pool = await poolPromise;
    await pool.request()
      .input('id',             sql.Int,     id)
      .input('resultado',      sql.VarChar(sql.MAX), resultado) // Permitir texto largo para el JSON
      .input('resultado_tipo', sql.VarChar, resultado_tipo)     // Guardará 'multiple' o el último tipo
      .query(`
        UPDATE dbo.citas
        SET resultado = @resultado, resultado_tipo = @resultado_tipo
        WHERE id = @id
      `);
  }

  // Horarios ocupados de un médico en una fecha
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

  async existeHorarioOcupado(id_medico, fecha, hora) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_medico', sql.Int,     id_medico)
      .input('fecha',     sql.Date,    fecha)
      .input('hora',      sql.VarChar, hora)
      .query(`
        SELECT id FROM dbo.citas
        WHERE id_medico = @id_medico
          AND fecha     = @fecha
          AND CONVERT(varchar(5), hora, 108) = @hora
          AND estado NOT IN ('cancelada')
      `);
    return result.recordset.length > 0;
  }

  // POST /api/citas — crear nueva cita
  async create({ id_usuario, id_medico, especialidad, fecha, hora, sede, tipo, motivo }) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_usuario',     sql.Int,     id_usuario)
      .input('id_medico',      sql.Int,     id_medico)
      .input('fecha', sql.VarChar, fecha)
      .input('hora',           sql.VarChar, hora)
      .input('estado',         sql.VarChar, 'pendiente')
      .input('especialidad',   sql.VarChar, especialidad  || null)
      .input('sede',           sql.VarChar, sede          || null)
      .input('tipo',           sql.VarChar, tipo          || null)
      .input('motivo',         sql.VarChar, motivo        || null)
      .input('fecha_registro', sql.Date,    new Date())
      .query(`
  INSERT INTO dbo.citas
  (id_usuario, id_medico, fecha, hora, estado,
   especialidad, sede, tipo, motivo, fecha_registro)
  OUTPUT INSERTED.id
  VALUES
    (@id_usuario, @id_medico, @fecha, @hora, @estado,
     @especialidad, @sede, @tipo, @motivo, @fecha_registro)
`);
    return result.recordset[0].id;
  }

  // PATCH /api/citas/:id/estado
  async updateEstado(id, estado) {
    const pool = await poolPromise;
    await pool.request()
      .input('id',     sql.Int,     id)
      .input('estado', sql.VarChar, estado)
      .query('UPDATE dbo.citas SET estado = @estado WHERE id = @id');
  }

  // GET /api/citas/todas
  async getCitasTodas() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT
          c.id,
          CONVERT(varchar(10), c.fecha, 23) AS fecha,
          CONVERT(varchar(5),  c.hora,  108) AS hora,
          c.estado, c.especialidad, c.sede, c.tipo, c.motivo,
          u.nombre   AS paciente_nombre,
          u.apellido AS paciente_apellido,
          m.nombre   AS medico_nombre,
          m.apellido AS medico_apellido
        FROM dbo.citas c
        LEFT JOIN dbo.usuarios u ON u.id = c.id_usuario
        LEFT JOIN dbo.medicos  m ON m.id = c.id_medico
        ORDER BY c.fecha DESC, c.hora ASC
      `);
    return result.recordset;
  }
}

module.exports = new CitaDAO();