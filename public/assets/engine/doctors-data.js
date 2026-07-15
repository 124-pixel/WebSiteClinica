const DOCTORS_DATA = {
  "001": {
    cmp:        "001",
    nombre:     "Dr. Ricardo Palma",
    apellido:   "Palma",
    especialidad: "Cardiología",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/5988.webp",
    sedes: [
      {
        nombre:    "Sede Central",
        direccion: "Av. Larco 123, Miraflores",
        telefono:  "987654321",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Lunes",    hora: "08:00 a 14:00" },
      { dia: "Miércoles", hora: "08:00 a 14:00" },
      { dia: "Viernes",  hora: "08:00 a 13:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",          universidad: "Universidad Nacional Mayor de San Marcos" },
      { titulo: "Especialidad en Cardiología", universidad: "Universidad Peruana Cayetano Heredia" },
    ]
  },

  "002": {
    cmp:        "002",
    nombre:     "Dra. Elena Torres",
    apellido:   "Torres",
    especialidad: "Pediatría",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/1000386.webp",
    sedes: [
      {
        nombre:    "Sede Central",
        direccion: "Av. Larco 123, Miraflores",
        telefono:  "987654321",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Martes",   hora: "09:00 a 17:00" },
      { dia: "Jueves",   hora: "09:00 a 17:00" },
      { dia: "Sábado",   hora: "09:00 a 13:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",        universidad: "Universidad Nacional Mayor de San Marcos" },
      { titulo: "Especialidad en Pediatría", universidad: "Universidad Peruana Cayetano Heredia" },
    ]
  },

  "003": {
    cmp:        "003",
    nombre:     "Dra. Paola Ríos",
    apellido:   "Ríos",
    especialidad: "Medicina General",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/5297.webp",
    sedes: [
      {
        nombre:    "Sede Central",
        direccion: "Av. Larco 123, Miraflores",
        telefono:  "987654321",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Lunes",    hora: "08:30 a 16:30" },
      { dia: "Miércoles", hora: "08:30 a 16:30" },
      { dia: "Viernes",  hora: "08:30 a 14:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",             universidad: "Universidad Nacional Mayor de San Marcos" },
      { titulo: "Medicina General",            universidad: "Universidad de Lima" },
    ]
  },

  "004": {
    cmp:        "004",
    nombre:     "Dr. Miguel Soto",
    apellido:   "Soto",
    especialidad: "Medicina General",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/6152.webp",
    sedes: [
      {
        nombre:    "Sede Norte",
        direccion: "Calle Los Olivos 456, Los Olivos",
        telefono:  "912345678",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Lunes",    hora: "10:00 a 18:00" },
      { dia: "Martes",   hora: "10:00 a 18:00" },
      { dia: "Jueves",   hora: "10:00 a 16:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",  universidad: "Universidad Ricardo Palma" },
      { titulo: "Medicina General", universidad: "Universidad Ricardo Palma" },
    ]
  },

  "005": {
    cmp:        "005",
    nombre:     "Dr. Andrés Paredes",
    apellido:   "Paredes",
    especialidad: "Dermatología",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/7026.webp",
    sedes: [
      {
        nombre:    "Sede Central",
        direccion: "Av. Larco 123, Miraflores",
        telefono:  "987654321",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Lunes",    hora: "08:00 a 14:00" },
      { dia: "Miércoles", hora: "08:00 a 14:00" },
      { dia: "Viernes",  hora: "08:00 a 12:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",           universidad: "Universidad Nacional Mayor de San Marcos" },
      { titulo: "Especialidad en Dermatología", universidad: "Universidad Peruana Cayetano Heredia" },
    ]
  },

  "006": {
    cmp:        "006",
    nombre:     "Dra. Carla Huanca",
    apellido:   "Huanca",
    especialidad: "Dermatología",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/8024.webp",
    sedes: [
      {
        nombre:    "Sede Norte",
        direccion: "Calle Los Olivos 456, Los Olivos",
        telefono:  "912345678",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Martes",   hora: "14:00 a 20:00" },
      { dia: "Jueves",   hora: "14:00 a 20:00" },
      { dia: "Sábado",   hora: "09:00 a 13:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",           universidad: "Universidad de Lima" },
      { titulo: "Especialidad en Dermatología", universidad: "Universidad Peruana Cayetano Heredia" },
    ]
  },

  "007": {
    cmp:        "007",
    nombre:     "Dr. Raúl Ccama",
    apellido:   "Ccama",
    especialidad: "Neurología",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/8664.webp",
    sedes: [
      {
        nombre:    "Sede Central",
        direccion: "Av. Larco 123, Miraflores",
        telefono:  "987654321",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Lunes",    hora: "07:00 a 15:00" },
      { dia: "Miércoles", hora: "07:00 a 15:00" },
      { dia: "Viernes",  hora: "07:00 a 13:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",          universidad: "Universidad Nacional Mayor de San Marcos" },
      { titulo: "Especialidad en Neurología", universidad: "Universidad Peruana Cayetano Heredia" },
    ]
  },

  "008": {
    cmp:        "008",
    nombre:     "Dr. Paul Rojas",
    apellido:   "Rojas",
    especialidad: "Traumatología",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/7184.webp",
    sedes: [
      {
        nombre:    "Sede Central",
        direccion: "Av. Larco 123, Miraflores",
        telefono:  "987654321",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Martes",   hora: "09:00 a 17:00" },
      { dia: "Jueves",   hora: "09:00 a 17:00" },
      { dia: "Sábado",   hora: "09:00 a 13:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",             universidad: "Universidad Ricardo Palma" },
      { titulo: "Especialidad en Traumatología", universidad: "Universidad Nacional Mayor de San Marcos" },
    ]
  },

  "009": {
    cmp:        "009",
    nombre:     "Dr. Felipe Lazo",
    apellido:   "Lazo",
    especialidad: "Gastroenterología",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/7156.webp",
    sedes: [
      {
        nombre:    "Sede Norte",
        direccion: "Calle Los Olivos 456, Los Olivos",
        telefono:  "912345678",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Lunes",    hora: "13:00 a 21:00" },
      { dia: "Miércoles", hora: "13:00 a 21:00" },
      { dia: "Viernes",  hora: "13:00 a 19:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",                universidad: "Universidad de Lima" },
      { titulo: "Especialidad en Gastroenterología", universidad: "Universidad Peruana Cayetano Heredia" },
    ]
  },

  "010": {
    cmp:        "010",
    nombre:     "Dra. Rosa Valdivia",
    apellido:   "Valdivia",
    especialidad: "Cardiología",
    atencion:   "Presencial",
    foto:       "../../public/assets/img/6552.webp",
    sedes: [
      {
        nombre:    "Sede Norte",
        direccion: "Calle Los Olivos 456, Los Olivos",
        telefono:  "912345678",
        foto:      ""
      }
    ],
    horarios: [
      { dia: "Lunes",    hora: "08:00 a 16:00" },
      { dia: "Miércoles", hora: "08:00 a 16:00" },
      { dia: "Viernes",  hora: "08:00 a 14:00" },
    ],
    educacion: [
      { titulo: "Médico Cirujano",          universidad: "Universidad Nacional Mayor de San Marcos" },
      { titulo: "Especialidad en Cardiología", universidad: "Universidad Peruana Cayetano Heredia" },
    ]
  },

};