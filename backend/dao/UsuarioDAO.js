/**
 * DAO - Data Access Object
 * Responsable de todas las consultas SQL
 * relacionadas con la tabla dbo.usuarios
 */
const { sql, poolPromise } = require('../config/Db');
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
}

module.exports = new UsuarioDAO();