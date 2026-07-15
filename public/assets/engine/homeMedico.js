const API_URL = "http://localhost:3000/api";

let medicoActual = null;
let todasLasCitas = [];
let citaSeleccionadaId = null;

// NUEVO: Array para guardar los elementos temporales agregados en el modal antes de enviar
let elementosTemporales = [];

/* ===========================
   CARGAR MÉDICO DESDE SESIÓN
=========================== */
function cargarMedico() {
  const medico = JSON.parse(
    localStorage.getItem('medico') || sessionStorage.getItem('medico') || 'null'
  );

  if (!medico) {
    window.location.href = '../views/Login.html';
    return null;
  }

  return medico;
}

/* ===========================
   NAVEGACIÓN ENTRE SECCIONES
=========================== */
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(id).classList.add('active');

  const map = { inicio: 0, pacientes: 1, agenda: 2, resultados: 3 };
  document.querySelectorAll('.nav-item')[map[id]]?.classList.add('active');

  if (id === 'pacientes')  pintarPacientes();
  if (id === 'agenda')     pintarAgendaCompleta();
  if (id === 'resultados') pintarResultados();

  window.scrollTo(0, 0);
}

/* ===========================
   FECHA DE HOY
=========================== */
function mostrarFecha(totalCitas) {
  const dateText = document.getElementById('dateText');
  const hoy = new Date();
  const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
  let fecha = hoy.toLocaleDateString('es-ES', opciones);
  fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  dateText.textContent = `${fecha} · ${totalCitas} paciente${totalCitas === 1 ? '' : 's'} agendado${totalCitas === 1 ? '' : 's'} hoy`;
}

/* ===========================
   TRAER TODAS LAS CITAS DEL MÉDICO (una sola vez)
=========================== */
async function cargarCitasMedico() {
  medicoActual = cargarMedico();
  if (!medicoActual) return;

  try {
    const res = await fetch(`${API_URL}/citas/medico/${medicoActual.id}`);
    const data = await res.json();

    if (!data.ok) {
      console.error('Error al obtener citas:', data.mensaje);
      return;
    }

    todasLasCitas = data.citas || [];

    const hoyStr = new Date().toISOString().split('T')[0];
    const citasHoy = todasLasCitas.filter(c => c.fecha === hoyStr);

    mostrarFecha(citasHoy.length);
    pintarAgendaHoy(citasHoy);
    actualizarStats(todasLasCitas, citasHoy);
    actualizarBadgeResultados();

  } catch (err) {
    console.error('Error de conexión al cargar citas:', err);
  }
}

/* ===========================
   MAPA DE ESTADOS (compartido)
=========================== */
const BADGE_MAP = {
  pendiente:  { clase: 'badge-warning', texto: 'En espera' },
  confirmada: { clase: 'badge-success', texto: 'Confirmado' },
  'en curso': { clase: 'badge-accent',  texto: 'En consulta' },
  cancelada:  { clase: 'badge-danger',  texto: 'Cancelado' },
  completada: { clase: 'badge-success', texto: 'Completado' },
};

function nombreCompletoPaciente(c) {
  return `${c.nombre_paciente || ''} ${c.apellido_paciente || ''}`.trim() || 'Paciente';
}

/* ===========================
   INICIO — Agenda de hoy
=========================== */
function pintarAgendaHoy(citasHoy) {
  const contenedor = document.getElementById('agendaList');

  if (!citasHoy.length) {
    contenedor.innerHTML = `<p style="text-align:center;color:var(--text-secondary);padding:24px 0;">No tienes citas programadas para hoy.</p>`;
    return;
  }

  const coloresAvatar = ['av-purple', 'av-orange', 'av-teal', 'av-blue'];

  contenedor.innerHTML = citasHoy.map((c, i) => {
    const nombre = nombreCompletoPaciente(c);
    const iniciales = nombre.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
    const estadoKey = (c.estado || 'pendiente').toLowerCase();
    const badge = BADGE_MAP[estadoKey] || BADGE_MAP.pendiente;
    const esActual = estadoKey === 'en curso';
    const avatarClase = coloresAvatar[i % coloresAvatar.length];

    return `
      <article class="patient-row ${esActual ? 'current' : ''}" data-cita-id="${c.id}">
        <div class="patient-avatar ${avatarClase}">${iniciales}</div>
        <div>
          <p class="patient-name">${nombre}</p>
          <p class="patient-reason">${c.motivo || c.especialidad || 'Consulta'}</p>
        </div>
        <div class="patient-meta">
          <span class="patient-time"><i class="ti ti-clock"></i>${c.hora || '—'}</span>
          <span class="badge ${badge.clase}">${badge.texto}</span>
        </div>
      </article>
    `;
  }).join('');
}

/* ===========================
   STATS
=========================== */
function actualizarStats(todas, citasHoy) {
  const confirmadas = citasHoy.filter(c => (c.estado || '').toLowerCase() === 'confirmada').length;
  const proxima = citasHoy.find(c => (c.estado || '').toLowerCase() !== 'cancelada');
  const pendientesResultado = todas.filter(c =>
    (c.estado || '').toLowerCase() === 'completada' && !c.resultado
  ).length;

  document.getElementById('statHoy').textContent = citasHoy.length;
  document.getElementById('statConfirmados').textContent = confirmadas;
  document.getElementById('statConfirmadosTag').textContent = `${confirmadas} de ${citasHoy.length}`;
  document.getElementById('statProxima').textContent = proxima ? proxima.hora : '—';
  document.getElementById('statPendientes').textContent = pendientesResultado;
}

function actualizarBadgeResultados() {
  const pendientes = todasLasCitas.filter(c =>
    (c.estado || '').toLowerCase() === 'completada' && !c.resultado
  ).length;
  document.getElementById('resultadosBadge').textContent = pendientes;
}

/* ===========================
   SECCIÓN PACIENTES
=========================== */
function pintarPacientes() {
  const tbody = document.getElementById('tablaPacientes');

  if (!todasLasCitas.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:24px;">Todavía no tienes pacientes.</td></tr>`;
    return;
  }

  const pacientesMap = {};
  todasLasCitas.forEach(c => {
    const key = c.id_paciente || nombreCompletoPaciente(c);
    if (!pacientesMap[key]) {
      pacientesMap[key] = {
        nombre: nombreCompletoPaciente(c),
        telefono: c.telefono_paciente || '—',
        citas: []
      };
    }
    pacientesMap[key].citas.push(c);
  });

  const hoyStr = new Date().toISOString().split('T')[0];

  const filas = Object.values(pacientesMap).map(p => {
    const citasOrdenadas = [...p.citas].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
    const pasadas = citasOrdenadas.filter(c => c.fecha <= hoyStr);
    const futuras = citasOrdenadas.filter(c => c.fecha > hoyStr && (c.estado || '').toLowerCase() !== 'cancelada');

    const ultima = pasadas.length ? pasadas[pasadas.length - 1] : null;
    const proxima = futuras.length ? futuras[0] : null;

    return `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.telefono}</td>
        <td>${p.citas.length}</td>
        <td>${ultima ? `${ultima.fecha} · ${ultima.hora}` : '—'}</td>
        <td>${proxima ? `${proxima.fecha} · ${proxima.hora}` : '—'}</td>
      </tr>
    `;
  });

  tbody.innerHTML = filas.join('');
}

/* ===========================
   SECCIÓN AGENDA COMPLETA
=========================== */
function pintarAgendaCompleta() {
  const tbody = document.getElementById('tablaAgenda');
  const filtro = document.getElementById('filtroAgendaEstado').value;

  let citas = [...todasLasCitas].sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));

  if (filtro !== 'todos') {
    citas = citas.filter(c => (c.estado || '').toLowerCase() === filtro);
  }

  if (!citas.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:24px;">No hay citas con ese filtro.</td></tr>`;
    return;
  }

  tbody.innerHTML = citas.map(c => {
    const estadoKey = (c.estado || 'pendiente').toLowerCase();
    const badge = BADGE_MAP[estadoKey] || BADGE_MAP.pendiente;
    return `
      <tr>
        <td>${c.fecha}</td>
        <td>${c.hora}</td>
        <td>${nombreCompletoPaciente(c)}</td>
        <td>${c.motivo || c.especialidad || '—'}</td>
        <td><span class="badge ${badge.clase}">${badge.texto}</span></td>
      </tr>
    `;
  }).join('');
}

/* ===========================
   SECCIÓN RESULTADOS Y RECETAS (Actualizado)
=========================== */
const TIPO_LABEL = {
  laboratorio: '🧪 Laboratorio',
  informe:     '📄 Informe',
  receta:      '💊 Receta',
  imagen:      '🫁 Imagen',
};

function pintarResultados() {
  const tbody = document.getElementById('tablaResultados');

  const citas = todasLasCitas
    .filter(c => ['confirmada', 'completada'].includes((c.estado || '').toLowerCase()))
    .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));

  if (!citas.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:24px;">No hay citas confirmadas o completadas todavía.</td></tr>`;
    return;
  }

  tbody.innerHTML = citas.map(c => {
    let previewTexto = `<span class="resultado-preview">Sin resultado todavía</span>`;

    if (c.resultado) {
      try {
        // Intentamos procesar el JSON con múltiples elementos
        const items = JSON.parse(c.resultado);
        if (Array.isArray(items) && items.length > 0) {
          previewTexto = items.map(i => {
            const label = TIPO_LABEL[i.tipo] || i.tipo.toUpperCase();
            return `<div class="resultado-preview-item" style="font-size:12px; margin-bottom: 2px;"><strong>${label}:</strong> ${i.detalle}</div>`;
          }).join('');
        }
      } catch (e) {
        // Si no es JSON (texto antiguo), se imprime normalmente
        const labelAntiguo = TIPO_LABEL[c.resultado_tipo] || '📄 Informe';
        previewTexto = `<span class="resultado-preview"><strong>${labelAntiguo}:</strong> ${c.resultado}</span>`;
      }
    }

    const tieneResultado = !!c.resultado;

    return `
      <tr>
        <td>${c.fecha}</td>
        <td>${nombreCompletoPaciente(c)}</td>
        <td>${c.motivo || c.especialidad || '—'}</td>
        <td><div style="max-height: 80px; overflow-y: auto;">${previewTexto}</div></td>
        <td>
          <button class="table-btn ${tieneResultado ? '' : 'primary'}" onclick="abrirModalResultado(${c.id})">
            ${tieneResultado ? 'Editar' : 'Agregar'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Abre el modal y rellena con los datos existentes
function abrirModalResultado(citaId) {
  const cita = todasLasCitas.find(c => c.id === citaId);
  if (!cita) return;

  citaSeleccionadaId = citaId;
  document.getElementById('modalResultadoPaciente').textContent = `${nombreCompletoPaciente(cita)} · ${cita.fecha}`;
  
  // Limpiar campos e inicializar la lista temporal
  document.getElementById('modalTexto').value = '';
  elementosTemporales = [];

  if (cita.resultado) {
    try {
      elementosTemporales = JSON.parse(cita.resultado);
      if (!Array.isArray(elementosTemporales)) {
        elementosTemporales = [];
      }
    } catch (e) {
      // Compatibilidad: si el dato existente era texto plano antiguo, lo convertimos al formato estructurado
      elementosTemporales = [{
        tipo: cita.resultado_tipo || 'informe',
        tipoTexto: TIPO_LABEL[cita.resultado_tipo || 'informe'],
        detalle: cita.resultado
      }];
    }
  }

  renderizarListaTemporal();
  
  // Modificado: Usar 'show' para encajar con el estilo CSS original de tu modal
  document.getElementById('modalResultado').classList.add('show');
}

function cerrarModalResultado() {
  document.getElementById('modalResultado').classList.remove('show');
  citaSeleccionadaId = null;
  elementosTemporales = [];
}

// NUEVO: Agrega un elemento a la vista previa local antes de enviarlo
function agregarElementoALaLista() {
  const tipoSelect = document.getElementById('modalTipo');
  const tipoValue = tipoSelect.value;
  const tipoTexto = tipoSelect.options[tipoSelect.selectedIndex].text;
  const detalleValue = document.getElementById('modalTexto').value.trim();

  if (!detalleValue) {
    alert("Por favor, escribe las indicaciones o el detalle antes de añadirlo.");
    return;
  }

  elementosTemporales.push({
    tipo: tipoValue,
    tipoTexto: tipoTexto,
    detalle: detalleValue
  });

  // Limpiar el área de texto para que se pueda escribir otro registro
  document.getElementById('modalTexto').value = "";
  renderizarListaTemporal();
}

// NUEVO: Dibuja la lista de elementos añadidos temporalmente dentro del modal
function renderizarListaTemporal() {
  const contenedor = document.getElementById('listaElementosAgregados');
  if (!contenedor) return;
  
  contenedor.innerHTML = "";

  if (elementosTemporales.length === 0) {
    contenedor.innerHTML = `<p style="text-align:center; color:var(--text-secondary); font-size:12px; padding: 8px 0;">No hay recetas ni exámenes agregados a esta cita.</p>`;
    return;
  }

  elementosTemporales.forEach((elem, index) => {
    const item = document.createElement('div');
    item.style = "background: rgba(0,0,0,0.03); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--blue-600, #2563eb); margin-bottom:4px;";
    item.innerHTML = `
      <div style="flex: 1; padding-right: 8px;">
        <strong style="font-size: 11px; color: var(--text-primary); display: block; text-transform: uppercase;">${elem.tipoTexto || elem.tipo}</strong>
        <span style="font-size: 13px; color: var(--text-secondary); white-space: pre-wrap;">${elem.detalle}</span>
      </div>
      <button onclick="eliminarElementoTemporal(${index})" style="background:transparent; border:none; color:#ef4444; cursor:pointer; padding:4px;" title="Eliminar">
        <i class="ti ti-trash" style="font-size: 16px;"></i>
      </button>
    `;
    contenedor.appendChild(item);
  });
}

// NUEVO: Remueve un item específico del array temporal
function eliminarElementoTemporal(index) {
  elementosTemporales.splice(index, 1);
  renderizarListaTemporal();
}

// NUEVO: Envía el listado consolidado al backend
async function guardarTodosLosResultados() {
  if (!citaSeleccionadaId) return;

  // Si el médico escribió algo pero olvidó darle clic al botón de agregar, lo adjuntamos automáticamente
  const textoHuerfano = document.getElementById('modalTexto').value.trim();
  if (textoHuerfano) {
    const tipoSelect = document.getElementById('modalTipo');
    elementosTemporales.push({
      tipo: tipoSelect.value,
      tipoTexto: tipoSelect.options[tipoSelect.selectedIndex].text,
      detalle: textoHuerfano
    });
    document.getElementById('modalTexto').value = "";
  }

  if (elementosTemporales.length === 0) {
    alert('Agrega al menos una orden, receta o informe médico antes de guardar.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/citas/${citaSeleccionadaId}/resultado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        resultado: JSON.stringify(elementosTemporales), // Se stringifica para almacenarlo en un solo campo
        resultado_tipo: elementosTemporales.length > 1 ? 'multiple' : elementosTemporales[0].tipo 
      })
    });
    
    const data = await res.json();

    if (!data.ok) {
      alert(data.mensaje || 'Error al guardar los resultados');
      return;
    }

    // Actualizar en memoria local
    const cita = todasLasCitas.find(c => c.id === citaSeleccionadaId);
    if (cita) {
      cita.resultado = JSON.stringify(elementosTemporales);
      cita.resultado_tipo = elementosTemporales.length > 1 ? 'multiple' : elementosTemporales[0].tipo;
      
      // Pasar a completada automáticamente para actualizar los indicadores clínicos
      if (cita.estado.toLowerCase() === 'confirmada') {
         cita.estado = 'completada';
      }
    }

    cerrarModalResultado();
    pintarResultados();
    actualizarStats(todasLasCitas, todasLasCitas.filter(c => c.fecha === new Date().toISOString().split('T')[0]));
    actualizarBadgeResultados();

  } catch (err) {
    console.error(err);
    alert('Error de conexión al guardar los resultados de la consulta.');
  }
}

// Dejar esta función apuntando al nuevo guardado por si el HTML llama explícitamente a guardarResultado()
function guardarResultado() {
  guardarTodosLosResultados();
}

/* ===========================
   BUSCADOR (filtra según la sección activa)
=========================== */
function activarBuscador() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll('#agendaList .patient-row').forEach(row => {
      const nombre = row.querySelector('.patient-name').textContent.toLowerCase();
      row.style.display = nombre.includes(query) ? 'flex' : 'none';
    });

    ['tablaPacientes', 'tablaAgenda', 'tablaResultados'].forEach(tablaId => {
      document.querySelectorAll(`#${tablaId} tr`).forEach(row => {
        const texto = row.textContent.toLowerCase();
        row.style.display = texto.includes(query) ? '' : 'none';
      });
    });
  });
}

/* ===========================
   NOTIFICACIONES, LOGOUT, MENÚ MÓVIL
=========================== */
function activarUI() {
  const bellBtn = document.getElementById('bellBtn');
  const bellDropdown = document.getElementById('bellDropdown');
  bellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    bellDropdown.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!bellDropdown.contains(e.target) && e.target !== bellBtn) {
      bellDropdown.classList.remove('open');
    }
  });

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('medico');
    sessionStorage.removeItem('medico');
    window.location.href = '../views/Login.html';
  });

  document.getElementById('supportBtn').addEventListener('click', () => {
    alert('Aquí se abriría el contacto de soporte técnico');
  });
}

/* ===========================
   INICIO
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  activarBuscador();
  activarUI();
  cargarCitasMedico();
});