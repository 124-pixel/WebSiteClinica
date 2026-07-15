 const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');
    const doc    = DOCTORS_DATA[id];

    if (!doc) {
      document.getElementById('page-content').innerHTML = `
        <div class="not-found">
          <h2>Médico no encontrado</h2>
          <p>El perfil que buscas no existe.</p>
          <a href="Physicians.html">← Volver al Staff Médico</a>
        </div>`;
    } else {
      document.title = `${doc.nombre} — Clínica`;
      document.getElementById('breadcrumb-nombre').textContent = doc.nombre;

      // Foto o placeholder
      const fotoHTML = doc.foto
        ? `<img src="${doc.foto}" alt="${doc.nombre}" onerror="this.parentElement.innerHTML='<div class=ph-svg><svg viewBox=0 0 80 80><circle cx=40 cy=28 r=18/><ellipse cx=40 cy=72 rx=28 ry=20/></svg></div>'" />`
        : `<div class="ph-svg"><svg viewBox="0 0 80 80"><circle cx="40" cy="28" r="18"/><ellipse cx="40" cy="72" rx="28" ry="20"/></svg></div>`;

      // Ícono atención
      const atencionIcon = doc.atencion === 'Virtual'
        ? `<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

      // Sedes
      const sedesHTML = doc.sedes.map(s => `
        <div class="sede-card">
          <div class="sede-img">
            ${s.foto ? `<img src="${s.foto}" alt="${s.nombre}" />` : `<span class="sede-ph">🏥</span>`}
          </div>
          <div class="sede-info">
            <div class="sede-nombre">${s.nombre}</div>
            <div class="sede-direccion">${s.direccion}</div>
            <div class="sede-tel">${s.telefono}</div>
            <a href="#" class="sede-link">Conoce más</a>
          </div>
        </div>`).join('');

      // Select sedes en card derecha
      const sedeOptions = doc.sedes.map(s =>
        `<option value="${s.nombre}">${s.nombre}</option>`
      ).join('');

      // Horarios
      const horariosHTML = doc.horarios.map(h => `
        <div class="horario-row">
          <span class="horario-dia">${h.dia}</span>
          <span class="horario-hora">${h.hora}</span>
        </div>`).join('');

      // Educación
      const eduHTML = doc.educacion.map(e => `
        <div class="edu-item">
          <div class="edu-icon">
            <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <div>
            <div class="edu-titulo">${e.titulo}</div>
            <div class="edu-univ">${e.universidad}</div>
          </div>
        </div>`).join('');

      document.getElementById('page-content').innerHTML = `
        <div class="wrapper">
          <div class="left-col">

            <div class="doctor-header">
              <div class="doctor-photo">${fotoHTML}</div>
              <div class="doctor-info">
                <div class="doctor-name">${doc.nombre}</div>
                <div class="doctor-tags">
                  <span class="tag-esp">${doc.especialidad}</span>
                  <span class="tag-sep">|</span>
                  <span class="tag-cmp">CMP: ${doc.cmp}</span>
                </div>
                <div class="doctor-atencion">
                  <span>Atención:</span>
                  ${atencionIcon}
                  <span class="atencion-label">${doc.atencion}</span>
                </div>
              </div>
            </div>

            <div class="section-block">
              <div class="section-title">Sedes</div>
              ${sedesHTML}
            </div>

            <div class="section-block">
              <div class="section-title">Educación</div>
              ${eduHTML}
            </div>

          </div>

          <div class="right-col">
            <div class="sticky-card">
              <div class="citas-card">
                <div class="citas-card-header">Sedes y horarios</div>
                <div class="citas-card-body">
                  <select class="select-field">
                    <option value="">${doc.especialidad}</option>
                  </select>
                  <select class="select-field">
                    ${sedeOptions}
                  </select>
                  ${horariosHTML}
                  <a href="../views/Login.html" class="btn-agendar">Ir a agendar cita</a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }