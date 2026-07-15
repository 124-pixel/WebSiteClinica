const DOCTORS = [
      { cmp:"001", name:"Dr. Ricardo Palma",  specialty:"Cardiología",       foto:"../../public/assets/img/5988.webp",  sedes:["Sede Central"], atencion:["Presencial"] },
      { cmp:"002", name:"Dra. Elena Torres",  specialty:"Pediatría",          foto:"../../public/assets/img/1000386.webp",  sedes:["Sede Central"], atencion:["Presencial"] },
      { cmp:"003", name:"Dra. Paola Ríos",    specialty:"Medicina General",   foto:"../../public/assets/img/5297.webp",  sedes:["Sede Central"], atencion:["Presencial"] },
      { cmp:"004", name:"Dr. Miguel Soto",    specialty:"Medicina General",   foto:"../../public/assets/img/6152.webp",  sedes:["Sede Norte"],   atencion:["Presencial"] },
      { cmp:"005", name:"Dr. Andrés Paredes", specialty:"Dermatología",       foto:"../../public/assets/img/7026.webp",  sedes:["Sede Central"], atencion:["Presencial"] },
      { cmp:"006", name:"Dra. Carla Huanca",  specialty:"Dermatología",       foto:"../../public/assets/img/8024.webp",  sedes:["Sede Norte"],   atencion:["Presencial"] },
      { cmp:"007", name:"Dr. Raúl Ccama",     specialty:"Neurología",         foto:"../../public/assets/img/8664.webp",  sedes:["Sede Central"], atencion:["Presencial"] },
      { cmp:"008", name:"Dr. Paul Rojas",     specialty:"Traumatología",      foto:"../../public/assets/img/7184.webp",  sedes:["Sede Central"], atencion:["Presencial"] },
      { cmp:"009", name:"Dr. Felipe Lazo",    specialty:"Gastroenterología",  foto:"../../public/assets/img/7156.webp",  sedes:["Sede Norte"],   atencion:["Presencial"] },
      { cmp:"010", name:"Dra. Rosa Valdivia", specialty:"Cardiología",        foto:"../../public/assets/img/6552.webp",  sedes:["Sede Norte"],   atencion:["Presencial"] },
      { cmp:"011", name:"Dra. Melissa Abigail", specialty:"Obstetricia",        foto:"../../public/assets/img/meli.webp",  sedes:["Mi Lugar Favorito"],   atencion:["24/7 en mis pensamientos"] }

    ];

    const PAGE_SIZE = 12;
    let currentPage = 1;
    let filtered = [...DOCTORS];

    // Llenar filtro de especialidades
    const specialties = [...new Set(DOCTORS.map(d => d.specialty))].sort();
    const sel = document.getElementById('specialtyFilter');
    specialties.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      sel.appendChild(opt);
    });

    function applyFilters() {
      currentPage = 1;
      const q       = document.getElementById('searchInput').value.toLowerCase().trim();
      const sp      = document.getElementById('specialtyFilter').value;
      const pres    = document.getElementById('presencial').checked;
      const virt    = document.getElementById('virtual').checked;
      const sedeCbs = [...document.querySelectorAll('.sede-cb:checked')].map(c => c.value);

      filtered = DOCTORS.filter(d => {
        if (q && !d.name.toLowerCase().includes(q)) return false;
        if (sp && d.specialty !== sp) return false;
        if (pres && !d.atencion.includes('Presencial')) return false;
        if (virt && !d.atencion.includes('Virtual')) return false;
        if (sedeCbs.length && !sedeCbs.some(s => d.sedes.includes(s))) return false;
        return true;
      });

      render();
    }

    function placeholderSVG() {
  return `<div class="placeholder">
    <svg viewBox="0 0 80 80"><circle cx="40" cy="28" r="18"/><ellipse cx="40" cy="72" rx="28" ry="20"/></svg>
  </div>`;
}

function render() {
  const grid  = document.getElementById('grid');
  const total = filtered.length;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filtered.slice(start, start + PAGE_SIZE);

  document.getElementById('resultsCount').textContent =
    `Mostrando ${start + 1}-${Math.min(start + PAGE_SIZE, total)} de ${total} médicos`;

  grid.innerHTML = page.map((d, i) => `
    <div class="card" style="animation-delay:${i * 40}ms">
      <div class="card-photo" id="photo-${i}">
        ${d.foto
          ? `<img src="${d.foto}" alt="${d.name}"
               onload="this.style.display='block'"
               onerror="this.style.display='none';document.getElementById('photo-${i}').innerHTML=placeholderSVG()" />`
          : placeholderSVG()
        }
      </div>
      <div class="card-body">
        <div class="cmp">CMP: ${d.cmp}</div>
        <div class="card-name">${d.name}</div>
        <div class="card-specialty">${d.specialty}</div>
        <a class="conoce-mas" href="detalle-doctor.html?id=${d.cmp}">Conoce más</a>
      </div>
    </div>
  `).join('');

  renderPagination(total);
}

    function renderPagination(total) {
      const pages = Math.ceil(total / PAGE_SIZE);
      const el    = document.getElementById('pagination');
      if (pages <= 1) { el.innerHTML = ''; return; }

      let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage===1?'disabled':''}>‹</button>`;
      for (let p = 1; p <= pages; p++) {
        if (p === 1 || p === pages || Math.abs(p - currentPage) <= 1) {
          html += `<button class="page-btn ${p===currentPage?'active':''}" onclick="goPage(${p})">${p}</button>`;
        } else if (Math.abs(p - currentPage) === 2) {
          html += `<span style="color:#9ca3af;padding:0 4px">…</span>`;
        }
      }
      html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage===pages?'disabled':''}>›</button>`;
      el.innerHTML = html;
    }

    function goPage(p) {
      const pages = Math.ceil(filtered.length / PAGE_SIZE);
      if (p < 1 || p > pages) return;
      currentPage = p;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    applyFilters();