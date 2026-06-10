/**
 * DTO - Data Transfer Object
 * Define la estructura del objeto Cita
 */
class CitaDTO {
  constructor({ id, id_usuario, id_medico, especialidad, fecha, hora, sede, tipo, motivo, estado, fecha_registro, nombre_paciente, nombre_medico, apellido_medico }) {
    this.id               = id;
    this.id_usuario       = id_usuario;
    this.id_medico        = id_medico;
    this.especialidad     = especialidad;
    this.fecha            = fecha;
    this.hora             = hora;
    this.sede             = sede;
    this.tipo             = tipo;
    this.motivo           = motivo;
    this.estado           = estado;
    this.fecha_registro   = fecha_registro;
    this.nombre_paciente  = nombre_paciente  || null;
    this.nombre_medico    = nombre_medico    || null;
    this.apellido_medico  = apellido_medico  || null;
  }
}

module.exports = CitaDTO;