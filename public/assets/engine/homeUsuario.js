const API_URL = "http://localhost:3000/api";
const HORARIOS = [
  "08:00","08:30","09:00","09:30",
  "10:00","10:30","11:00","11:30",
  "15:00","15:30","16:00","16:30",
  "17:00","17:30"
];

let selectedDoctor   = null;
let selectedDoctorId = null;
let selectedHora     = null;
let citasUsuarioCache = [];

const today = new Date().toISOString().split('T')[0];
document.getElementById('fecha-cita').min   = today;
document.getElementById('fecha-cita').value = today;


async function cargarEspecialidades() {
  try {
    const res  = await fetch(`${API_URL}/especialidades`);
    const data = await res.json();
    const select = document.getElementById('especialidad');
    select.innerHTML = '<option value="">— Seleccionar —</option>';
    data.especialidades.forEach(e => {
      const opt = document.createElement('option');
      opt.value       = e.nombre;
      opt.textContent = e.nombre;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Error cargando especialidades:', err);
  }
}


async function cargarSedes() {
  try {
    const res  = await fetch(`${API_URL}/sedes`);
    const data = await res.json();
    const select = document.getElementById('sede');
    select.innerHTML = '<option value="">— Seleccionar sede —</option>';
    data.sedes.forEach(s => {
      const opt = document.createElement('option');
      opt.value       = s.id;
      opt.textContent = s.nombre;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Error cargando sedes:', err);
  }
}

/* ===========================
   CARGAR NOMBRE USUARIO DESDE SESSION
=========================== */
function cargarUsuario() {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
    );
    if (usuario) {
      const nameEl   = document.querySelector('.user-name');
      const avatarEl = document.querySelector('.user-chip .avatar');
      const titleEl  = document.querySelector('#inicio .page-title');
      if (nameEl)   nameEl.textContent   = usuario.nombre;
      if (avatarEl) avatarEl.textContent = usuario.nombre.substring(0, 2).toUpperCase();
      if (titleEl)  titleEl.textContent  = `Hola, ${usuario.nombre.split(' ')[0]} 👋`;
    }
  } catch (err) {
    console.error('Error cargando usuario:', err);
  }
}

cargarEspecialidades();
cargarSedes();
cargarUsuario();

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const map = { inicio:0, agendar:1, 'mis-citas':2, resultados:3, perfil:4 };
  document.querySelectorAll('.nav-item')[map[id]]?.classList.add('active');

  if (id === 'mis-citas')  cargarMisCitas();
  if (id === 'resultados') cargarResultados();
  window.scrollTo(0, 0);
}

async function cargarDoctores() {
  const esp  = document.getElementById('especialidad').value;
  const sec  = document.getElementById('doctors-section');
  const list = document.getElementById('doctor-list');

  selectedDoctor   = null;
  selectedDoctorId = null;

  if (!esp) { sec.style.display = 'none'; return; }

  try {
    const res  = await fetch(`${API_URL}/medicos?especialidad=${encodeURIComponent(esp)}`);
    const data = await res.json();

    if (!data.ok || data.medicos.length === 0) {
      sec.style.display = 'block';
      list.innerHTML = '<p style="color:#6b7280;font-size:14px;">No hay médicos disponibles para esta especialidad.</p>';
      return;
    }

    sec.style.display = 'block';
    list.innerHTML = data.medicos.map(m => `
      <div class="doctor-card" onclick="selDoc(this, ${m.id}, '${m.nombreCompleto}')">
        <div class="doctor-head">
          <div class="doctor-avatar">${m.nombre.charAt(0)}</div>
          <div>
            <div class="doctor-name">${m.nombreCompleto}</div>
            <div class="doctor-esp">${m.especialidad}</div>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
    alert('Error al cargar médicos');
  }
}

function selDoc(el, id, nombre) {
  document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedDoctor   = nombre;
  selectedDoctorId = id;
}

async function cargarHorarios() {
  const fecha = document.getElementById('fecha-cita').value;
  const grid  = document.getElementById('horarios-grid');
  selectedHora = null;

  try {
    const res  = await fetch(`${API_URL}/medicos/${selectedDoctorId}/horarios?fecha=${fecha}`);
    const data = await res.json();
    const ocupados = data.ocupados || [];

    grid.innerHTML = HORARIOS.map(h => {
      const ocupado = ocupados.includes(h);
      return `
        <button class="hora-btn ${ocupado ? 'ocupado' : ''}"
          ${ocupado ? 'disabled' : `onclick="selHora(this,'${h}')"`}>
          ${h}
        </button>`;
    }).join('');

  } catch (err) {
    console.error(err);
    alert('Error cargando horarios');
  }
}

function selHora(el, hora) {
  document.querySelectorAll('.hora-btn:not(.ocupado)').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedHora = hora;
}

async function irStep2() {
  const esp = document.getElementById('especialidad').value;
  if (!esp)            { alert('Por favor selecciona una especialidad.'); return; }
  if (!selectedDoctor) { alert('Por favor selecciona un médico.');        return; }
  await cargarHorarios();
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  markStep(2);
}

function irStep1() {
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
  markStep(1);
}

function irStep3() {
  const fecha = document.getElementById('fecha-cita').value;
  if (!fecha)        { alert('Seleccione una fecha.');  return; }
  if (!selectedHora) { alert('Seleccione un horario.'); return; }

  const espOpt  = document.getElementById('especialidad');
  const sedeOpt = document.getElementById('sede');
  const tipoOpt = document.getElementById('tipo-consulta');

  document.getElementById('res-esp').textContent   = espOpt.options[espOpt.selectedIndex].text;
  document.getElementById('res-doc').textContent   = selectedDoctor;
  document.getElementById('res-fecha').textContent = fecha;
  document.getElementById('res-hora').textContent  = selectedHora;
  document.getElementById('res-sede').textContent  = sedeOpt.options[sedeOpt.selectedIndex].text;
  document.getElementById('res-tipo').textContent  = tipoOpt.options[tipoOpt.selectedIndex].text;

  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'block';
  markStep(3);
}

function irStep2Desde3() {
  document.getElementById('step3').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  markStep(2);
}

function markStep(n) {
  [1,2,3].forEach(i => {
    const el = document.getElementById(`step${i}-ind`);
    el.classList.remove('active','done');
    if (i < n) el.classList.add('done');
    if (i === n) el.classList.add('active');
  });
  document.getElementById('line-1-2').classList.toggle('done', n > 1);
  document.getElementById('line-2-3').classList.toggle('done', n > 2);
}

async function confirmarCita() {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
    );
    if (!usuario) { alert('Debes iniciar sesión nuevamente'); return; }

    const sedeOpt = document.getElementById('sede');
    const sedeId  = sedeOpt.value;
    const sedeNombre = sedeOpt.options[sedeOpt.selectedIndex].text;

    const body = {
      id_usuario:   usuario.id,
      id_medico:    selectedDoctorId,
      fecha:        document.getElementById('res-fecha').textContent,
      hora:         document.getElementById('res-hora').textContent,
      especialidad: document.getElementById('res-esp').textContent,
      sede:         sedeNombre,
      tipo:         document.getElementById('res-tipo').textContent,
      motivo:       document.getElementById('motivo').value
    };

    const res  = await fetch(`${API_URL}/citas`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) { alert(data.mensaje || 'Error al registrar cita'); return; }

    document.getElementById('m-esp').textContent   = body.especialidad;
    document.getElementById('m-doc').textContent   = selectedDoctor;
    document.getElementById('m-fecha').textContent = `${body.fecha} · ${body.hora}`;
    document.getElementById('m-sede').textContent  = sedeNombre;
    document.getElementById('modal-confirm').classList.add('show');

  } catch (err) {
    console.error(err);
    alert('Error de conexión');
  }
}

function cerrarModal() {
  document.getElementById('modal-confirm').classList.remove('show');
  document.getElementById('especialidad').value = '';
  document.getElementById('doctors-section').style.display = 'none';

  selectedDoctor   = null;
  selectedDoctorId = null;
  selectedHora     = null;

  document.getElementById('step3').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
  markStep(1);
  showSection('mis-citas');
}

async function cargarMisCitas() {
  try {
    const usuario = JSON.parse(
      localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
    );
    if (!usuario) return;

    const res  = await fetch(`${API_URL}/citas/usuario/${usuario.id}`);
    const data = await res.json();
    const tbody = document.getElementById('tabla-citas');

    if (!data.ok || data.citas.length === 0) {
      citasUsuarioCache = [];
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:32px;color:#6b7280;">
            No tienes citas registradas aún.
          </td>
        </tr>`;
      return;
    }

    citasUsuarioCache = data.citas;

    tbody.innerHTML = data.citas.map(c => {
      const fecha  = c.fecha ? c.fecha.toString().substring(0, 10) : '—';
      const hora   = c.hora  ? c.hora.toString().substring(0, 5)   : '—';
      const medico = c.nombre_medico ? `${c.nombre_medico} ${c.apellido_medico || ''}`.trim() : '—';
      const estado = c.estado?.toLowerCase() || 'pendiente';
      const tieneResultado = !!c.resultado;

      const botonAccion = tieneResultado
        ? `<button class="btn-sm primary" onclick="showSection('resultados')">Resultado</button>`
        : `<button class="btn-sm outline">Ver</button>`;

      return `
        <tr>
          <td>${fecha} · ${hora}</td>
          <td>${c.especialidad || '—'}</td>
          <td>${medico}</td>
          <td>${c.sede || '—'}</td>
          <td><span class="badge ${estado}">${c.estado}</span></td>
          <td>${botonAccion}</td>
        </tr>`;
    }).join('');

  } catch (err) {
    console.error('Error cargando mis citas:', err);
  }
}

/* ===========================
   RESULTADOS Y RECETAS (datos reales)
=========================== */
/* ===========================
   RESULTADOS Y RECETAS (Actualizado para Múltiples Registros JSON)
=========================== */
const TIPO_ICONO = {
  laboratorio: '🧪',
  informe:     '📄',
  receta:      '💊',
  imagen:      '🫁',
};

const TIPO_TITULO = {
  laboratorio: 'Resultado de laboratorio',
  informe:     'Informe médico',
  receta:      'Receta médica',
  imagen:      'Imagen / estudio',
};

async function cargarResultados() {
  const contenedor = document.getElementById('resultados-list');

  try {
    // Reusa la caché si ya se cargó en "Mis citas"; si no, la trae de la API
    if (!citasUsuarioCache.length) {
      const usuario = JSON.parse(
        localStorage.getItem('usuario') || sessionStorage.getItem('usuario')
      );
      if (!usuario) return;

      const res  = await fetch(`${API_URL}/citas/usuario/${usuario.id}`);
      const data = await res.json();
      if (data.ok) citasUsuarioCache = data.citas;
    }

    // Filtramos solo las citas que tengan algún contenido en el resultado
    const conResultado = citasUsuarioCache.filter(c => c.resultado);

    if (!conResultado.length) {
      contenedor.innerHTML = `
        <p style="text-align:center;color:#6b7280;padding:32px 0;">
          Todavía no tienes resultados ni recetas disponibles.
        </p>`;
      return;
    }

    let htmlCards = [];

    conResultado.forEach(c => {
      const fecha  = c.fecha ? c.fecha.toString().substring(0, 10) : '—';
      const medico = c.nombre_medico ? `${c.nombre_medico} ${c.apellido_medico || ''}`.trim() : '—';
      
      try {
        // Intentamos parsear el JSON múltiple enviado por el médico
        const items = JSON.parse(c.resultado);
        
        if (Array.isArray(items)) {
          // Por cada elemento dentro del JSON, generamos una tarjeta independiente para el paciente
          items.forEach(item => {
            htmlCards.push(`
              <div class="resultado-card" data-tipo="${item.tipo}">
                <div class="resultado-icon">${TIPO_ICONO[item.tipo] || '📄'}</div>
                <div class="resultado-info">
                  <div class="resultado-titulo">${TIPO_TITULO[item.tipo] || 'Resultado'}</div>
                  <div class="resultado-meta">${fecha} &nbsp;·&nbsp; ${medico} – ${c.especialidad || ''} &nbsp;·&nbsp; ${c.sede || ''}</div>
                  <div class="resultado-detalle" style="white-space: pre-wrap;">${item.detalle}</div>
                </div>
              </div>`);
          });
        }
      } catch (e) {
        // Modo de compatibilidad: Si no es un JSON (texto plano antiguo), lo renderizamos como antes
        const tipoAntiguo = c.resultado_tipo || 'informe';
        htmlCards.push(`
          <div class="resultado-card" data-tipo="${tipoAntiguo}">
            <div class="resultado-icon">${TIPO_ICONO[tipoAntiguo] || '📄'}</div>
            <div class="resultado-info">
              <div class="resultado-titulo">${TIPO_TITULO[tipoAntiguo] || 'Resultado'}</div>
              <div class="resultado-meta">${fecha} &nbsp;·&nbsp; ${medico} – ${c.especialidad || ''} &nbsp;·&nbsp; ${c.sede || ''}</div>
              <div class="resultado-detalle">${c.resultado}</div>
            </div>
          </div>`);
      }
    });

    if (htmlCards.length === 0) {
      contenedor.innerHTML = `<p style="text-align:center;color:#6b7280;padding:32px 0;">Todavía no tienes resultados ni recetas disponibles.</p>`;
    } else {
      contenedor.innerHTML = htmlCards.join('');
    }

  } catch (err) {
    console.error('Error cargando resultados:', err);
    contenedor.innerHTML = `<p style="text-align:center;color:#6b7280;padding:32px 0;">Error al cargar tus resultados.</p>`;
  }
}

function filtrarResultados(btn, tipo) {
  // 1. Quitar la clase seleccionada de los botones de filtro de la sección resultados
  // Ajustado para que apunte de forma segura a tus botones superiores de la vista de resultados
  document.querySelectorAll('.section#resultados .hora-btn, #resultados button').forEach(b => b.classList.remove('selected'));
  
  // En caso de que tus botones usen clases de Tabler o clases activas personalizadas:
  btn.parentNode.querySelectorAll('button').forEach(b => b.classList.remove('active', 'selected'));
  btn.classList.add('active'); // O 'selected' según tus estilos CSS del layout del paciente

  // 2. Filtrar las tarjetas mapeando el atributo data-tipo individual que extrajimos del JSON
  document.querySelectorAll('#resultados-list .resultado-card').forEach(c => {
    if (tipo === 'todos' || c.dataset.tipo === tipo) {
      c.style.display = 'flex';
    } else {
      c.style.display = 'none';
    }
  });

}