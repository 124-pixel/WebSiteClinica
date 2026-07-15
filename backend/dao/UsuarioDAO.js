/**
 * DAO - Data Access Object
 * Responsable de todas las consultas SQL
 * relacionadas con la tabla dbo.usuarios
 */
const { sql, poolPromise } = require('../config/db');
const UsuarioDTO = require('../models/UsuarioDTO');

class UsuarioDAO {

  // Buscar usuario por correo
  async findByCorreo(correo) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query(`
        SELECT u.id, u.nombre, u.correo, u.contrasena,
               u.telefono, u.id_rol, u.fecha_registro, u.estado,
               r.nombre_rol
        FROM dbo.usuarios u
        LEFT JOIN dbo.roles r ON u.id_rol = r.id
        WHERE u.correo = @correo
      `);
    return result.recordset[0] || null;
  }

  // Buscar usuario por ID
  async findById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT u.id, u.nombre, u.correo,
               u.telefono, u.id_rol, u.fecha_registro, u.estado,
               r.nombre_rol
        FROM dbo.usuarios u
        LEFT JOIN dbo.roles r ON u.id_rol = r.id
        WHERE u.id = @id
      `);
    if (!result.recordset[0]) return null;
    return new UsuarioDTO(result.recordset[0]);
  }

  // Obtener todos los usuarios
  async findAll() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT u.id, u.nombre, u.correo,
               u.telefono, u.id_rol, u.fecha_registro, u.estado,
               r.nombre_rol
        FROM dbo.usuarios u
        LEFT JOIN dbo.roles r ON u.id_rol = r.id
        ORDER BY u.id
      `);
    return result.recordset.map(row => new UsuarioDTO(row));
  }

  // Crear nuevo usuario
  async create({ nombre, correo, contrasena, telefono, id_rol }) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre',     sql.VarChar, nombre)
      .input('correo',     sql.VarChar, correo)
      .input('contrasena', sql.VarChar, contrasena)
      .input('telefono',   sql.VarChar, telefono || null)
      .input('id_rol',     sql.Int,     id_rol)
      .query(`
        INSERT INTO dbo.usuarios (nombre, correo, contrasena, telefono, id_rol, estado)
        OUTPUT INSERTED.id
        VALUES (@nombre, @correo, @contrasena, @telefono, @id_rol, 'activo')
      `);
    return result.recordset[0].id;
  }

  // Crear nuevo paciente desde el panel de administración
  async createPaciente({ nombre, apellido, dni, correo, contrasena, telefono }) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre',     sql.VarChar, nombre)
      .input('apellido',   sql.VarChar, apellido)
      .input('dni',        sql.VarChar, dni)
      .input('correo',     sql.VarChar, correo)
      .input('contrasena', sql.VarChar, contrasena)
      .input('telefono',   sql.VarChar, telefono || null)
      .input('id_rol',     sql.Int,     2) // <-- Fijo 2 porque tu BD dice que 2 = Paciente
      .query(`
        INSERT INTO dbo.usuarios (nombre, apellido, dni, correo, contrasena, telefono, id_rol, estado, fecha_registro)
        OUTPUT INSERTED.id
        VALUES (@nombre, @apellido, @dni, @correo, @contrasena, @telefono, @id_rol, 'Activo', GETDATE())
      `);
    return result.recordset[0].id;
  }

  // Actualizar usuario
  async update(id, { nombre, telefono, estado }) {
    const pool = await poolPromise;
    await pool.request()
      .input('id',       sql.Int,     id)
      .input('nombre',   sql.VarChar, nombre)
      .input('telefono', sql.VarChar, telefono || null)
      .input('estado',   sql.VarChar, estado)
      .query(`
        UPDATE dbo.usuarios
        SET nombre = @nombre, telefono = @telefono, estado = @estado
        WHERE id = @id
      `);
  }

  // Eliminar usuario
  async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.usuarios WHERE id = @id');
  }

  // Agrega esto dentro de tu UsuarioDAO.js

async getPacientes() {
  try {
    // Importamos la conexión desde tu Db.js
    const { sql, poolPromise } = require('../config/Db');
    const pool = await poolPromise;

    // Hacemos la consulta SQL cruzando con roles para asegurarnos de traer solo PACIENTES
    // Nota: Si en tu tabla el id_rol de paciente es un número fijo (ej. 1 o 2), puedes usarlo directamente.
    // Aquí lo cruzamos con la tabla roles por nombre_rol = 'paciente' para asegurar.
    const result = await pool.request().query(`
      SELECT u.id, u.nombre, u.apellido, u.dni, u.correo, u.telefono, u.estado, u.fecha_registro
      FROM dbo.usuarios u
      INNER JOIN dbo.roles r ON u.id_rol = r.id
      WHERE r.nombre_rol = 'paciente' OR u.id_rol = 2 
      ORDER BY u.nombre ASC
    `);

    // Retornamos las filas obtenidas
    return result.recordset;
  } catch (err) {
    console.error('Error en UsuarioDAO.getPacientes:', err.message);
    throw err;
  }
}
}

module.exports = new UsuarioDAO();