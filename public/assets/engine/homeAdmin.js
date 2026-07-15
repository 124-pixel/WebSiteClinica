const API = 'http://localhost:3000/api';
let todasLasCitas    = [];
let todosPacientes   = [];
let todosMedicos     = [];
let todasCitasAll    = [];

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f97316','#6366f1','#ec4899','#14b8a6','#f59e0b'];
function colorLetra(l) { return COLORS[(l.toUpperCase().charCodeAt(0)-65) % COLORS.length]; }

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// ── NAVEGACIÓN ────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  const idx = { dashboard:0, patients:1, doctors:2, appointments:3 };
  document.querySelectorAll('.nav-item')[idx[id] ?? 0]?.classList.add('active');

  if (id === 'patients')     cargarPacientes();
  if (id === 'doctors')      cargarMedicos();
  if (id === 'appointments') cargarTodasCitas();
}

function onTopbarSearch() {
  const q = document.getElementById('topbar-search').value.toLowerCase().trim();
  if (!q) return;
  // redirige a patients con filtro
  showSection('patients');
  document.getElementById('search-patients').value = q;
  filtrarPacientes();
}

// ── FORMATEAR HORA ────────────────────────────────────────────
function formatHora(hora) {
  if (!hora) return '—';
  const [h, m] = String(hora).split(':');
  const hNum = parseInt(h);
  const sufijo = hNum >= 12 ? 'PM' : 'AM';
  const h12 = hNum % 12 || 12;
  return `${String(h12).padStart(2,'0')}:${m} ${sufijo}`;
}

function labelEstado(e) {
  const map = { pendiente:'Pendiente', confirmada:'Confirmed', en_progreso:'In Progress', completada:'Completed', cancelada:'Cancelled' };
  return map[e] || e;
}

// ── CITAS DE HOY ──────────────────────────────────────────────
async function cargarCitasHoy() {
  const loading = document.getElementById('appt-loading');
  const lista   = document.getElementById('appt-list');
  const empty   = document.getElementById('appt-empty');
  try {
    const res  = await fetch(`${API}/citas/hoy`, { headers: { Authorization: `Bearer ${getToken()}` } });
    if (res.status === 401 || res.status === 403) { cerrarSesion(); return; }
    const data = await res.json();
    if (loading) loading.style.display = 'none';
    if (!data.ok || !data.citas || data.citas.length === 0) {
      if (empty) empty.style.display = 'block';
      document.getElementById('stat-total-citas').textContent = '0';
      return;
    }
    todasLasCitas = data.citas;
    document.getElementById('stat-total-citas').textContent = data.citas.length;
    const pendientes = data.citas.filter(c => c.estado === 'pendiente').length;
    if (pendientes > 0) {
      document.getElementById('alert-nuevas-citas').style.display = 'flex';
      document.getElementById('alert-nuevas-texto').textContent = `${pendientes} cita${pendientes>1?'s':''} pendiente${pendientes>1?'s':''} de confirmar.`;
    }
    filtrarLista();
  } catch (err) {
    if (loading) loading.style.display = 'none';
    if (lista) lista.innerHTML = `<div style="padding:32px;text-align:center;"><div style="font-size:2rem">⚠️</div><div style="font-weight:700;color:#dc2626;margin:8px 0 4px">No se pudo conectar con el servidor</div><button onclick="cargarCitasHoy()" style="padding:8px 20px;background:var(--blue);color:white;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">Reintentar</button></div>`;
  }
}

function renderCita(cita) {
  const nombre = `${cita.paciente_nombre || '?'} ${cita.paciente_apellido || ''}`.trim();
  const medico = cita.medico_nombre ? `Dr. ${cita.medico_nombre} ${cita.medico_apellido || ''}` : cita.especialidad || '—';
  const inicial = nombre.charAt(0).toUpperCase();
  const div = document.createElement('div');
  div.className = 'appt-item';
  div.dataset.estado = cita.estado;
  div.innerHTML = `
    <div class="appt-avatar" style="background:${colorLetra(inicial)}">${inicial}</div>
    <div class="appt-info">
      <div class="appt-name">${nombre}</div>
      <div class="appt-doctor">${medico}</div>
    </div>
    <div class="appt-time">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ${formatHora(cita.hora)}
    </div>
    <span class="status-badge ${cita.estado}">${labelEstado(cita.estado)}</span>
    <select class="estado-select" onchange="cambiarEstado(${cita.id}, this.value, this)">
      <option value="pendiente"   ${cita.estado==='pendiente'   ?'selected':''}>Pendiente</option>
      <option value="confirmada"  ${cita.estado==='confirmada'  ?'selected':''}>Confirmada</option>
      <option value="en_progreso" ${cita.estado==='en_progreso' ?'selected':''}>En progreso</option>
      <option value="completada"  ${cita.estado==='completada'  ?'selected':''}>Completada</option>
      <option value="cancelada"   ${cita.estado==='cancelada'   ?'selected':''}>Cancelada</option>
    </select>`;
  return div;
}

function filtrarLista() {
  const filtro = document.getElementById('filtro-estado').value;
  const lista  = document.getElementById('appt-list');
  lista.innerHTML = '';
  const filtradas = filtro ? todasLasCitas.filter(c => c.estado === filtro) : todasLasCitas;
  if (!filtradas.length) {
    lista.innerHTML = `<div style="padding:24px;text-align:center;font-size:13px;color:var(--text-muted);">Sin citas con ese estado.</div>`;
    return;
  }
  filtradas.forEach(c => lista.appendChild(renderCita(c)));
}

async function cambiarEstado(id, nuevoEstado, selectEl) {
  try {
    const res = await fetch(`${API}/citas/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    const data = await res.json();
    if (!data.ok) { alert('No se pudo actualizar: ' + data.mensaje); return; }
    const badge = selectEl.closest('.appt-item').querySelector('.status-badge');
    if (badge) { badge.className = `status-badge ${nuevoEstado}`; badge.textContent = labelEstado(nuevoEstado); }
    const cita = todasLasCitas.find(c => c.id === id);
    if (cita) cita.estado = nuevoEstado;
  } catch (err) { console.error(err); }
}

// ── PACIENTES ─────────────────────────────────────────────────
async function cargarPacientes() {
  // Eliminamos la validación en caché para forzar la actualización tras registrar un paciente nuevo
  document.getElementById('patients-loading').style.display = 'block';
  document.getElementById('patients-table').style.display   = 'none';
  document.getElementById('patients-empty').style.display   = 'none';
  try {
    const res  = await fetch(`${API}/usuarios/pacientes`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    document.getElementById('patients-loading').style.display = 'none';
    if (!data.ok || !data.pacientes || !data.pacientes.length) {
      document.getElementById('patients-empty').style.display = 'block'; return;
    }
    todosPacientes = data.pacientes;
    
    const statNum = document.getElementById('stat-num-pacientes');
    const statTotal = document.getElementById('stat-total-pacientes');
    if (statNum) statNum.textContent = data.pacientes.length;
    if (statTotal) statTotal.textContent = data.pacientes.length;
    
    renderPacientes(todosPacientes);
  } catch (err) {
    document.getElementById('patients-loading').innerHTML = `<div style="color:#dc2626;font-size:14px;">Error al cargar pacientes. <button onclick="cargarPacientes()" style="color:var(--blue);background:none;border:none;cursor:pointer;font-weight:600;">Reintentar</button></div>`;
  }
}

function renderPacientes(lista) {
  const tbody = document.getElementById('patients-tbody');
  const table = document.getElementById('patients-table');
  const empty = document.getElementById('patients-empty');
  if (!lista.length) { table.style.display='none'; empty.style.display='block'; return; }
  table.style.display = 'table';
  empty.style.display = 'none';
  tbody.innerHTML = lista.map(p => {
    const nombre   = `${p.nombre || ''} ${p.apellido || ''}`.trim();
    const inicial  = nombre.charAt(0).toUpperCase() || '?';
    const estado   = (p.estado || 'null').toLowerCase();
    const estadoLabel = p.estado || 'Sin estado';
    return `
      <tr>
        <td>
          <div class="patient-name-cell">
            <div class="patient-avatar" style="background:${colorLetra(inicial)}">${inicial}</div>
            <div>
              <div class="patient-name">${nombre}</div>
              <div class="patient-sub">${p.correo || '—'}</div>
            </div>
          </div>
        </td>
        <td>${p.dni || '—'}</td>
        <td>${p.correo || '—'}</td>
        <td>${p.telefono || '—'}</td>
        <td><span class="badge-estado ${estado}">${estadoLabel}</span></td>
        <td style="display:flex;gap:6px;">
          <button class="btn-sm-action" onclick="verPaciente(${p.id})">Ver</button>
        </td>
      </tr>`;
  }).join('');
}

function filtrarPacientes() {
  const q = document.getElementById('search-patients').value.toLowerCase().trim();
  if (!q) { renderPacientes(todosPacientes); return; }
  const filtrados = todosPacientes.filter(p =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
    (p.dni && p.dni.includes(q)) ||
    (p.correo && p.correo.toLowerCase().includes(q))
  );
  renderPacientes(filtrados);
}

function verPaciente(id) {
  const p = todosPacientes.find(x => x.id === id);
  if (!p) return;
  document.getElementById('mp-nombre').textContent   = `${p.nombre || ''} ${p.apellido || ''}`.trim();
  document.getElementById('mp-dni').textContent      = p.dni      || '—';
  document.getElementById('mp-correo').textContent   = p.correo   || '—';
  document.getElementById('mp-telefono').textContent = p.telefono || '—';
  document.getElementById('mp-estado').textContent   = p.estado   || '—';
  document.getElementById('mp-fecha').textContent    = p.fecha_registro ? p.fecha_registro.toString().substring(0,10) : '—';
  document.getElementById('modal-patient').classList.add('show');
}

function cerrarModalPaciente() {
  document.getElementById('modal-patient').classList.remove('show');
}

// ── MÉDICOS ───────────────────────────────────────────────────
async function cargarMedicos() {
  if (todosMedicos.length) { renderMedicos(todosMedicos); return; }
  document.getElementById('doctors-loading').style.display = 'block';
  document.getElementById('doctors-table').style.display   = 'none';
  try {
    const res  = await fetch(`${API}/medicos`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    document.getElementById('doctors-loading').style.display = 'none';
    if (!data.ok || !data.medicos.length) { document.getElementById('doctors-empty').style.display='block'; return; }
    todosMedicos = data.medicos;
    document.getElementById('stat-num-medicos').textContent   = data.medicos.length;
    document.getElementById('stat-total-medicos').textContent = data.medicos.length;
    renderMedicos(todosMedicos);
  } catch (err) {
    document.getElementById('doctors-loading').innerHTML = `<div style="color:#dc2626;padding:24px;text-align:center;">Error al cargar médicos.</div>`;
  }
}

function renderMedicos(lista) {
  const tbody = document.getElementById('doctors-tbody');
  const table = document.getElementById('doctors-table');
  const empty = document.getElementById('doctors-empty');
  if (!lista.length) { table.style.display='none'; empty.style.display='block'; return; }
  table.style.display = 'table';
  empty.style.display = 'none';
  tbody.innerHTML = lista.map(m => {
    const nombre  = `${m.nombre || ''} ${m.apellido || ''}`.trim();
    const inicial = nombre.charAt(0).toUpperCase() || '?';
    const estado  = (m.estado || 'null').toLowerCase();
    return `
      <tr>
        <td>
          <div class="patient-name-cell">
            <div class="patient-avatar" style="background:${colorLetra(inicial)}">${inicial}</div>
            <div>
              <div class="patient-name">${nombre}</div>
              <div class="patient-sub">${m.correo || '—'}</div>
            </div>
          </div>
        </td>
        <td>${m.especialidad || '—'}</td>
        <td>${m.sede || '—'}</td>
        <td>${m.correo || '—'}</td>
        <td><span class="badge-estado ${estado}">${m.estado || '—'}</span></td>
      </tr>`;
  }).join('');
}

function filtrarMedicos() {
  const q = document.getElementById('search-doctors').value.toLowerCase().trim();
  if (!q) { renderMedicos(todosMedicos); return; }
  const filtrados = todosMedicos.filter(m =>
    `${m.nombre} ${m.apellido}`.toLowerCase().includes(q) ||
    (m.especialidad && m.especialidad.toLowerCase().includes(q))
  );
  renderMedicos(filtrados);
}

// ── TODAS LAS CITAS ───────────────────────────────────────────
async function cargarTodasCitas() {
  if (todasCitasAll.length) { renderTodasCitas(todasCitasAll); return; }
  document.getElementById('appts-all-loading').style.display = 'block';
  document.getElementById('appts-all-table').style.display   = 'none';
  try {
    const res  = await fetch(`${API}/citas/todas`, { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    document.getElementById('appts-all-loading').style.display = 'none';
    if (!data.ok || !data.citas.length) { document.getElementById('appts-all-empty').style.display='block'; return; }
    todasCitasAll = data.citas;
    renderTodasCitas(todasCitasAll);
  } catch (err) {
    document.getElementById('appts-all-loading').innerHTML = `<div style="color:#dc2626;padding:24px;text-align:center;">Error al cargar citas.</div>`;
  }
}

function renderTodasCitas(lista) {
  const tbody = document.getElementById('appts-all-tbody');
  const table = document.getElementById('appts-all-table');
  const empty = document.getElementById('appts-all-empty');
  if (!lista.length) { table.style.display='none'; empty.style.display='block'; return; }
  table.style.display = 'table';
  empty.style.display = 'none';
  tbody.innerHTML = lista.map(c => {
    const paciente = `${c.paciente_nombre || '?'} ${c.paciente_apellido || ''}`.trim();
    const medico   = c.medico_nombre ? `${c.medico_nombre} ${c.medico_apellido || ''}`.trim() : '—';
    const estado   = (c.estado || 'pendiente').toLowerCase();
    return `
      <tr>
        <td>${paciente}</td>
        <td>${c.especialidad || '—'}</td>
        <td>${medico}</td>
        <td>${c.fecha ? String(c.fecha).substring(0,10) : '—'}</td>
        <td>${formatHora(c.hora)}</td>
        <td>${c.sede || '—'}</td>
        <td><span class="status-badge ${estado}">${labelEstado(estado)}</span></td>
      </tr>`;
  }).join('');
}

function filtrarTodasCitas() {
  const q      = document.getElementById('search-appts').value.toLowerCase().trim();
  const estado = document.getElementById('filtro-estado-all').value;
  let filtradas = todasCitasAll;
  if (q) filtradas = filtradas.filter(c =>
    `${c.paciente_nombre} ${c.paciente_apellido}`.toLowerCase().includes(q) ||
    (c.especialidad && c.especialidad.toLowerCase().includes(q))
  );
  if (estado) filtradas = filtradas.filter(c => c.estado === estado);
  renderTodasCitas(filtradas);
}

// ── CERRAR SESIÓN ─────────────────────────────────────────────
function cerrarSesion() {
  localStorage.removeItem('token'); localStorage.removeItem('usuario');
  sessionStorage.removeItem('token'); sessionStorage.removeItem('usuario');
  window.location.href = '../views/Login.html';
}

// ── LÓGICA EXCLUSIVA DEL MODAL DE PACIENTES ───────────────────
function abrirModalCrearPaciente() {
  const modal = document.getElementById('modal-crear-paciente');
  if (modal) {
    modal.classList.add('active');
  }
}

function cerrarModalCrearPaciente() {
  const modal = document.getElementById('modal-crear-paciente');
  if (modal) {
    modal.classList.remove('active');
    const form = document.getElementById('form-registro-paciente');
    if (form) form.reset();
  }
}

async function registrarPaciente(event) {
  event.preventDefault();

  const nombre = document.getElementById('reg-nombre').value.trim();
  const apellido = document.getElementById('reg-apellido').value.trim();
  const dni = document.getElementById('reg-dni').value.trim();
  const telefono = document.getElementById('reg-telefono').value.trim();
  const correo = document.getElementById('reg-correo').value.trim();
  const contrasena = document.getElementById('reg-contrasena').value.trim();

  try {
    const res = await fetch(`${API}/usuarios/pacientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ nombre, apellido, dni, telefono, correo, contrasena })
    });

    // Validamos primero si la respuesta contiene un texto/json válido antes de parsear
    const contentType = res.headers.get("content-type");
    let data = {};
    
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const textoPlano = await res.text();
      data = { mensaje: textoPlano };
    }

    if (res.ok) {
      alert('¡Paciente registrado con éxito!');
      cerrarModalCrearPaciente();
      
      // Forzar recarga limpia si la función nativa falla
      if (typeof cargarPacientes === 'function') {
        cargarPacientes();
      } else {
        window.location.reload();
      }
    } else {
      // Ahora sí verás el error real que escupe Node.js o SQL Server
      alert(`Error en el servidor (${res.status}): ${data.error || data.mensaje || 'Error desconocido en backend'}`);
    }
  } catch (err) {
    console.error('Error crítico en fetch:', err);
    alert('No se pudo establecer contacto con el servidor. Verifica que Node.js esté corriendo en el puerto 3000.');
  }
}

// Asignamos las funciones al objeto global window para asegurar su acceso desde el HTML
window.abrirModalCrearPaciente = abrirModalCrearPaciente;
window.cerrarModalCrearPaciente = cerrarModalCrearPaciente;
window.registrarPaciente = registrarPaciente;

// ── INIT ──────────────────────────────────────────────────────
cargarCitasHoy();
setInterval(cargarCitasHoy, 60000);