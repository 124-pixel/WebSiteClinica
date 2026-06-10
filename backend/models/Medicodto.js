/**
 * DTO — Data Transfer Object para Médicos
 */
console.log('ENTRANDO A Medicodto');
class RespuestaMedicoDTO {
  constructor(row) {
    this.id = row.id;
    this.nombre = row.nombre;
    this.apellido = row.apellido;
    this.nombreCompleto = `Dr. ${row.nombre} ${row.apellido}`;
    this.especialidad = row.especialidad;
  }

  static fromArray(rows) {
    return rows.map(r => new RespuestaMedicoDTO(r));
  }
}


class FiltrosMedicoDTO {
  /**
   * DTO para los query params al buscar médicos
   * @param {object} query - req.query
   */
  constructor(query) {
    this.especialidad = query.especialidad || null;
  }

  esValido() {
    return this.especialidad !== null;
  }
}

console.log('RespuestaMedicoDTO:', typeof RespuestaMedicoDTO);
console.log('FiltrosMedicoDTO:', typeof FiltrosMedicoDTO);
module.exports = { RespuestaMedicoDTO, FiltrosMedicoDTO };