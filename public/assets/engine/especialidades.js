const SPECIALTIES = [
  {
    name: "Cardiología",
    icon: "❤️",
    categoria: "Médica",
    atencion: ["Presencial"],
    sedes: ["Lima", "San Isidro", "Surco"],
    desc: "Cuidado del corazón y sistema circulatorio."
  },
  {
    name: "Pediatría",
    icon: "👶",
    categoria: "Médica",
    atencion: ["Presencial", "Virtual"],
    sedes: ["Lima", "La Molina", "Surco"],
    desc: "Atención médica para niños y adolescentes."
  },
  {
    name: "Medicina General",
    icon: "🩺",
    categoria: "Médica",
    atencion: ["Presencial", "Virtual"],
    sedes: ["Lima", "San Borja", "San Isidro"],
    desc: "Consulta médica primaria para la prevención, diagnóstico y tratamiento de enfermedades comunes."
  },
  {
    name: "Dermatología",
    icon: "🧴",
    categoria: "Médica",
    atencion: ["Presencial", "Virtual"],
    sedes: ["Lima", "San Isidro"],
    desc: "Diagnóstico y tratamiento de enfermedades de la piel."
  },
  {
    name: "Neurología",
    icon: "🧠",
    categoria: "Médica",
    atencion: ["Presencial", "Virtual"],
    sedes: ["San Borja", "La Molina"],
    desc: "Atención de enfermedades del sistema nervioso."
  },
  {
    name: "Traumatología",
    icon: "🦴",
    categoria: "Quirúrgica",
    atencion: ["Presencial"],
    sedes: ["Lima", "San Isidro", "Surco"],
    desc: "Diagnóstico y tratamiento del aparato locomotor."
  },
  {
    name: "Gastroenterología",
    icon: "🫃",
    categoria: "Médica",
    atencion: ["Presencial"],
    sedes: ["Lima", "San Borja"],
    desc: "Enfermedades del sistema digestivo."
  },
  {
    name: "Oftalmología",
    icon: "👁️",
    categoria: "Quirúrgica",
    atencion: ["Presencial"],
    sedes: ["Lima", "San Borja"],
    desc: "Atención de enfermedades de los ojos."
  }
];
    const PAGE_SIZE = 8;
    let currentPage = 1;
    let filtered = [...SPECIALTIES];

    function applyFilters() {
      currentPage = 1;
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      const cat = document.getElementById('categoryFilter').value;
      const pres = document.getElementById('presencial').checked;
      const virt = document.getElementById('virtual').checked;
      const sedeCbs = [...document.querySelectorAll('.sede-cb:checked')].map(c => c.value);

      filtered = SPECIALTIES.filter(s => {
        if (q && !s.name.toLowerCase().includes(q)) return false;
        if (cat && s.categoria !== cat) return false;
        if (pres && !s.atencion.includes('Presencial')) return false;
        if (virt && !s.atencion.includes('Virtual')) return false;
        if (sedeCbs.length && !sedeCbs.some(sd => s.sedes.includes(sd))) return false;
        return true;
      });

      render();
    }

    function render() {
      const total = filtered.length;
      const start = (currentPage - 1) * PAGE_SIZE;
      const page = filtered.slice(start, start + PAGE_SIZE);

      document.getElementById('resultsCount').textContent =
        total === 0
          ? 'No se encontraron especialidades'
          : `Mostrando ${start + 1}-${Math.min(start + PAGE_SIZE, total)} de ${total} especialidades`;

      document.getElementById('list').innerHTML = page.map((s, i) => `
  <a href="detalle-especialidad.html?especialidad=${encodeURIComponent(s.name)}" class="specialty-item" style="animation-delay:${i * 50}ms; text-decoration: none; color: inherit; display: flex;">
    <div class="specialty-icon">${s.icon}</div>
    <div class="specialty-info">
      <div class="specialty-name">${s.name}</div>
      <div class="specialty-desc">${s.desc}</div>
    </div>
    <div class="specialty-arrow">
      <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  </a>
`).join('');

      renderPagination(total);
    }

    function renderPagination(total) {
      const pages = Math.ceil(total / PAGE_SIZE);
      const el = document.getElementById('pagination');
      if (pages <= 1) { el.innerHTML = ''; return; }

      let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
      for (let p = 1; p <= pages; p++) {
        if (p === 1 || p === pages || Math.abs(p - currentPage) <= 1) {
          html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="goPage(${p})">${p}</button>`;
        } else if (Math.abs(p - currentPage) === 2) {
          html += `<span style="color:#9ca3af;padding:0 4px">…</span>`;
        }
      }
      html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}>›</button>`;
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