const ESPECIALIDADES_DATA = {
  "cardiologia": {
    id:           "cardiologia",
    nombre:       "Cardiología",
    icono:        "❤️",
    descripcion:  "Cuidamos la salud de tu corazón con tecnología avanzada y un equipo de cardiólogos altamente capacitados.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Cardiología</strong> de la Clínica Internacional ofrece atención integral para el diagnóstico, tratamiento y prevención de enfermedades del corazón y el sistema cardiovascular. Nuestro equipo de especialistas brinda soluciones personalizadas con equipos de última generación como ecocardiogramas, electrocardiogramas y pruebas de esfuerzo.",
    beneficios: [
      {
        titulo: "Diagnóstico avanzado con tecnología de punta",
        desc:   "Contamos con equipos de última generación para diagnóstico cardiovascular preciso, incluyendo ecocardiografía, Holter y monitoreo de presión ambulatoria."
      },
      {
        titulo: "Atención con especialistas altamente capacitados",
        desc:   "Nuestro equipo de cardiólogos se mantiene en constante capacitación, participando en programas internacionales para ofrecer los tratamientos más innovadores."
      },
      {
        titulo: "Prevención y control de enfermedades cardíacas",
        desc:   "Brindamos programas de prevención cardiovascular, control de hipertensión, diabetes y otros factores de riesgo para mantener tu corazón saludable."
      }
    ],
    sedes: [
      { nombre: "Sede Central", direccion: "Av. Larco 123, Miraflores" },
      { nombre: "Sede Norte",   direccion: "Calle Los Olivos 456, Los Olivos" },
    ],
    medicos: ["001", "010"]
  },

  "pediatria": {
    id:           "pediatria",
    nombre:       "Pediatría",
    icono:        "👶",
    descripcion:  "Atención médica integral para niños y adolescentes con especialistas comprometidos con su bienestar.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Pediatría</strong> de la Clínica Internacional brinda atención médica integral a niños y adolescentes desde el nacimiento hasta los 18 años. Nuestros pediatras ofrecen controles de crecimiento, vacunación, diagnóstico y tratamiento de enfermedades infantiles con un enfoque humano y cercano.",
    beneficios: [
      {
        titulo: "Atención especializada desde el primer día de vida",
        desc:   "Nuestros neonatólogos y pediatras acompañan el desarrollo del niño desde el nacimiento, asegurando un crecimiento saludable en cada etapa."
      },
      {
        titulo: "Ambiente amigable y seguro para los pequeños",
        desc:   "Contamos con instalaciones diseñadas para hacer la visita médica una experiencia tranquila y positiva para los niños y sus familias."
      },
      {
        titulo: "Seguimiento personalizado del desarrollo infantil",
        desc:   "Realizamos controles periódicos de crecimiento, desarrollo psicomotor y nutricional para asegurar el bienestar integral de cada niño."
      }
    ],
    sedes: [
      { nombre: "Sede Central", direccion: "Av. Larco 123, Miraflores" },
    ],
    medicos: ["002"]
  },

  "medicina-general": {
    id:           "medicina-general",
    nombre:       "Medicina General",
    icono:        "🏥",
    descripcion:  "Consulta médica primaria para diagnóstico y tratamiento de enfermedades comunes con atención personalizada.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Medicina General</strong> de la Clínica Internacional ofrece consultas médicas de primera línea para el diagnóstico y tratamiento de enfermedades agudas y crónicas. Nuestros médicos generales brindan atención integral, orientando al paciente hacia especialistas cuando es necesario.",
    beneficios: [
      {
        titulo: "Atención primaria rápida y eficiente",
        desc:   "Nuestros médicos generales atienden de forma oportuna enfermedades respiratorias, digestivas, infecciosas y otros padecimientos comunes."
      },
      {
        titulo: "Referencia oportuna al especialista",
        desc:   "Cuando el caso lo requiere, coordinamos de forma inmediata la derivación al especialista más adecuado para tu condición."
      },
      {
        titulo: "Control y seguimiento de enfermedades crónicas",
        desc:   "Brindamos seguimiento a pacientes con hipertensión, diabetes, obesidad y otras enfermedades crónicas para mejorar su calidad de vida."
      }
    ],
    sedes: [
      { nombre: "Sede Central", direccion: "Av. Larco 123, Miraflores" },
      { nombre: "Sede Norte",   direccion: "Calle Los Olivos 456, Los Olivos" },
    ],
    medicos: ["003", "004"]
  },

  "dermatologia": {
    id:           "dermatologia",
    nombre:       "Dermatología",
    icono:        "🩺",
    descripcion:  "Cuidamos la salud de tu piel con tecnología avanzada y un equipo de dermatólogos altamente capacitados.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Dermatología</strong> de la Clínica Internacional ofrece atención integral para el diagnóstico, tratamiento y prevención de enfermedades de la piel, cabello y uñas. Nuestro equipo de especialistas brinda soluciones personalizadas con tratamientos innovadores y mínimamente invasivos.",
    beneficios: [
      {
        titulo: "Diagnóstico avanzado con certificaciones de calidad",
        desc:   "Garantizamos un diagnóstico preciso y confiable gracias a nuestras certificaciones en dermatología, respaldadas por estándares internacionales de calidad."
      },
      {
        titulo: "Atención con especialistas altamente capacitados",
        desc:   "Nuestro equipo de dermatólogos se mantiene en constante capacitación, participando en programas de actualización para ofrecer los tratamientos más innovadores."
      },
      {
        titulo: "Consulta dermatológica con profesionales certificados",
        desc:   "Brindamos atención especializada asegurando un enfoque profesional y personalizado en cada consulta, ya sea presencial o en línea."
      }
    ],
    sedes: [
      { nombre: "Sede Central", direccion: "Av. Larco 123, Miraflores" },
      { nombre: "Sede Norte",   direccion: "Calle Los Olivos 456, Los Olivos" },
    ],
    medicos: ["005", "006"]
  },

  "neurologia": {
    id:           "neurologia",
    nombre:       "Neurología",
    icono:        "🧠",
    descripcion:  "Diagnóstico y tratamiento de enfermedades del sistema nervioso con tecnología de vanguardia.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Neurología</strong> de la Clínica Internacional ofrece atención especializada en el diagnóstico y tratamiento de enfermedades del sistema nervioso central y periférico. Tratamos cefaleas, epilepsia, esclerosis múltiple, Parkinson, Alzheimer y trastornos del sueño.",
    beneficios: [
      {
        titulo: "Diagnóstico preciso con tecnología neurológica avanzada",
        desc:   "Contamos con electroencefalogramas, resonancias magnéticas y pruebas neuropsicológicas para un diagnóstico completo y certero."
      },
      {
        titulo: "Tratamiento integral de enfermedades neurológicas",
        desc:   "Nuestros neurólogos trabajan en equipo con otras especialidades para ofrecer un tratamiento multidisciplinario y personalizado."
      },
      {
        titulo: "Seguimiento continuo del paciente neurológico",
        desc:   "Realizamos controles periódicos para monitorear la evolución del tratamiento y ajustar las terapias según las necesidades del paciente."
      }
    ],
    sedes: [
      { nombre: "Sede Central", direccion: "Av. Larco 123, Miraflores" },
    ],
    medicos: ["007"]
  },

  "traumatologia": {
    id:           "traumatologia",
    nombre:       "Traumatología",
    icono:        "🦴",
    descripcion:  "Diagnóstico y tratamiento del aparato locomotor con cirujanos ortopédicos de alto nivel.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Traumatología</strong> de la Clínica Internacional ofrece atención especializada en lesiones y enfermedades del aparato locomotor. Tratamos fracturas, lesiones deportivas, artritis, artrosis y realizamos cirugías ortopédicas con técnicas mínimamente invasivas.",
    beneficios: [
      {
        titulo: "Cirugía ortopédica con técnicas minimamente invasivas",
        desc:   "Utilizamos técnicas artroscópicas y de cirugía mínimamente invasiva para una recuperación más rápida y menos dolorosa."
      },
      {
        titulo: "Rehabilitación integral post quirúrgica",
        desc:   "Contamos con un equipo de fisioterapeutas que acompaña la recuperación del paciente después de cada procedimiento quirúrgico."
      },
      {
        titulo: "Atención de lesiones deportivas",
        desc:   "Brindamos atención especializada a deportistas amateur y profesionales para una recuperación óptima y un retorno seguro a la actividad física."
      }
    ],
    sedes: [
      { nombre: "Sede Central", direccion: "Av. Larco 123, Miraflores" },
    ],
    medicos: ["008"]
  },

  "gastroenterologia": {
    id:           "gastroenterologia",
    nombre:       "Gastroenterología",
    icono:        "🫀",
    descripcion:  "Diagnóstico y tratamiento de enfermedades del sistema digestivo con endoscopistas expertos.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Gastroenterología</strong> de la Clínica Internacional ofrece atención especializada en enfermedades del aparato digestivo, incluyendo esófago, estómago, intestino, hígado, vesícula y páncreas. Realizamos endoscopias, colonoscopias y tratamientos de enfermedades digestivas complejas.",
    beneficios: [
      {
        titulo: "Endoscopias y colonoscopias con equipos de última generación",
        desc:   "Contamos con equipos endoscópicos de alta definición para un diagnóstico preciso y procedimientos seguros y cómodos para el paciente."
      },
      {
        titulo: "Tratamiento de enfermedades digestivas complejas",
        desc:   "Nuestros gastroenterólogos tienen experiencia en el manejo de enfermedades inflamatorias intestinales, cirrosis, hepatitis y cáncer digestivo."
      },
      {
        titulo: "Prevención del cáncer colorrectal",
        desc:   "Realizamos colonoscopias de tamizaje para la detección temprana de pólipos y cáncer colorrectal, salvando vidas con diagnóstico oportuno."
      }
    ],
    sedes: [
      { nombre: "Sede Norte", direccion: "Calle Los Olivos 456, Los Olivos" },
    ],
    medicos: ["009"]
  },

  "oftalmologia": {
    id:           "oftalmologia",
    nombre:       "Oftalmología",
    icono:        "👁️",
    descripcion:  "Cuidado integral de la salud visual con cirujanos oftalmólogos especializados y tecnología láser.",
    atencion:     ["Presencial"],
    info_general: "El departamento de <strong>Oftalmología</strong> de la Clínica Internacional ofrece atención integral para el cuidado de los ojos. Realizamos cirugías refractivas con láser, tratamiento de cataratas, glaucoma, retinopatía diabética y degeneración macular, con equipos de diagnóstico de última generación.",
    beneficios: [
      {
        titulo: "Cirugía refractiva láser de última generación",
        desc:   "Corregimos problemas de visión como miopía, hipermetropía y astigmatismo con tecnología láser de precisión para resultados óptimos."
      },
      {
        titulo: "Diagnóstico y tratamiento del glaucoma",
        desc:   "Detectamos y tratamos el glaucoma en sus etapas más tempranas para preservar la visión y calidad de vida del paciente."
      },
      {
        titulo: "Atención pediátrica oftalmológica",
        desc:   "Evaluamos y tratamos problemas visuales en niños, incluyendo estrabismo y ambliopía, para asegurar un desarrollo visual adecuado."
      }
    ],
    sedes: [
      { nombre: "Sede Central", direccion: "Av. Larco 123, Miraflores" },
      { nombre: "Sede Norte",   direccion: "Calle Los Olivos 456, Los Olivos" },
    ],
    medicos: []
  },
};