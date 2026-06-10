/**
 * DTO - Data Transfer Object
 * Define la estructura del objeto Usuario
 * que viaja entre las capas de la aplicación
 */
class UsuarioDTO {
  constructor({ id, nombre, correo, telefono, id_rol, nombre_rol, fecha_registro, estado }) {
    this.id             = id;
    this.nombre         = nombre;
    this.correo         = correo;
    this.telefono       = telefono;
    this.id_rol         = id_rol;
    this.nombre_rol     = nombre_rol;
    this.fecha_registro = fecha_registro;
    this.estado         = estado;
  }
}

module.exports = UsuarioDTO;