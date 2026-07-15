 const params       = new URLSearchParams(window.location.search);
const nombreUrl    = params.get('especialidad');

// Buscamos dentro de las propiedades del objeto principal
const esp = Object.values(ESPECIALIDADES_DATA).find(
  elemento => elemento.nombre.toLowerCase() === nombreUrl?.toLowerCase()
);

    if (!esp) {
      document.getElementById('page-content').innerHTML = `
        <div class="not-found">
          <h2>Especialidad no encontrada</h2>
          <p>La especialidad que buscas no existe.</p>
          <a href="especialidades.html">← Volver a Especialidades</a>
        </div>`;
    } else {
      document.title = `${esp.nombre} — Clínica`;
      document.getElementById('breadcrumb-nombre').textContent = esp.nombre;

      // Atención tags
      const atencionHTML = esp.atencion.map(a => {
        const icon = a === 'Virtual'
          ? `<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`
          : `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        return `<div class="atencion-tag">${icon} ${a}</div>`;
      }).join('');

      // Beneficios
      const beneficiosHTML = esp.beneficios.map(b => `
        <div class="beneficio-item">
          <div class="beneficio-icon">
            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/></svg>
          </div>
          <div>
            <div class="beneficio-titulo">${b.titulo}</div>
            <div class="beneficio-desc">${b.desc}</div>
          </div>
        </div>`).join('');

      // Staff médico
      const staffHTML = esp.medicos.length
        ? `<div class="staff-grid">${esp.medicos.map(cmp => {
            const doc = DOCTORS_DATA[cmp];
            if (!doc) return '';
            const avatarHTML = doc.foto
              ? `<img src="${doc.foto}" alt="${doc.nombre}" onerror="this.parentElement.innerHTML='<span class=ph>👤</span>'" />`
              : `<span class="ph">👤</span>`;
            return `
              <a class="staff-card" href="detalle-doctor.html?id=${doc.cmp}">
                <div class="staff-avatar">${avatarHTML}</div>
                <div>
                  <div class="staff-nombre">${doc.nombre}</div>
                  <div class="staff-esp">${doc.especialidad}</div>
                </div>
              </a>`;
          }).join('')}</div>`
        : `<p class="staff-empty">No hay médicos registrados para esta especialidad aún.</p>`;

      // Sedes card
      const sedesHTML = esp.sedes.map(s => `
        <div class="sede-row">
          <span class="sede-nombre">${s.nombre}</span>
          <span class="sede-dir">${s.direccion}</span>
        </div>`).join('');

      document.getElementById('page-content').innerHTML = `
        <div class="wrapper">
          <div class="left-col">

            <div class="esp-header">
              <div class="esp-title-row">
                <div class="esp-icono">${esp.icono}</div>
                <h1 class="esp-nombre">${esp.nombre}</h1>
              </div>
              <p class="esp-desc">${esp.descripcion}</p>
              <div class="atencion-row">
                <span>Atención:</span>
                ${atencionHTML}
              </div>
            </div>

            <div class="tabs">
              <button class="tab active" onclick="switchTab('info', this)">Información General</button>
              <button class="tab" onclick="switchTab('staff', this)">Staff Médico</button>
            </div>

            <div id="tab-info" class="tab-content active">
              <p class="info-text">${esp.info_general}</p>
              <hr class="divider" />
              <p class="beneficios-title">Beneficios para pacientes</p>
              ${beneficiosHTML}
            </div>

            <div id="tab-staff" class="tab-content">
              ${staffHTML}
            </div>

          </div>

          <div class="right-col">
            <div class="sticky-card">
              <div class="sedes-card">
                <div class="sedes-card-header">Sedes disponibles</div>
                <div class="sedes-card-body">
                  ${sedesHTML}
                </div>
                <a href="../views/home.html" class="btn-agendar">Ir a agendar cita</a>
              </div>
            </div>
          </div>
        </div>`;
    }

    function switchTab(id, el) {
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + id).classList.add('active');
      el.classList.add('active');
    }