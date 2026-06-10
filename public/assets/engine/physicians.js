const DOCTORS = [
      { cmp:"034572", name:"Terry Mora Monica Tatiana",     specialty:"Medicina Interna", sedes:["Lima","San Isidro"],  atencion:["Presencial","Virtual"] },
      { cmp:"016284", name:"Soto Anamaco Nelson Felipe",    specialty:"Medicina Interna", sedes:["San Borja","Surco"],  atencion:["Presencial"] },
      { cmp:"015719", name:"Caceres Vargas Doris",          specialty:"Psiquiatría",      sedes:["La Molina","Lima"],   atencion:["Presencial","Virtual"] },
      { cmp:"013978", name:"Flores Bustamante Claver Reynaldo", specialty:"Psiquiatría",  sedes:["San Isidro"],         atencion:["Virtual"] },
      { cmp:"022341", name:"Quispe Huanca Pedro Luis",      specialty:"Cardiología",      sedes:["Lima","Surco"],       atencion:["Presencial"] },
      { cmp:"031177", name:"Ramirez Torres Ana Cecilia",    specialty:"Neurología",       sedes:["San Borja"],          atencion:["Presencial","Virtual"] },
      { cmp:"044829", name:"Chávez Mendoza Carlos Alberto", specialty:"Traumatología",    sedes:["La Molina","Surco"],  atencion:["Presencial"] },
      { cmp:"028654", name:"Villanueva Rosas Carmen Elena", specialty:"Ginecología",      sedes:["Lima","San Isidro"],  atencion:["Virtual"] },
      { cmp:"019203", name:"Huamani Torres Jorge Luis",     specialty:"Medicina Interna", sedes:["San Borja","Lima"],   atencion:["Presencial"] },
      { cmp:"037461", name:"Espinoza Paredes Luz Marina",   specialty:"Dermatología",     sedes:["Surco","San Isidro"], atencion:["Presencial","Virtual"] },
      { cmp:"052187", name:"Condori Mamani Rosa Edith",     specialty:"Psiquiatría",      sedes:["La Molina"],          atencion:["Virtual"] },
      { cmp:"041095", name:"Tapia Cárdenas Manuel Jesús",   specialty:"Cardiología",      sedes:["Lima","San Borja"],   atencion:["Presencial"] },
      { cmp:"023567", name:"Huanca Flores Betty Marleni",   specialty:"Neurología",       sedes:["San Isidro","Surco"], atencion:["Presencial","Virtual"] },
      { cmp:"038920", name:"Medina Castro Ricardo Omar",    specialty:"Traumatología",    sedes:["Lima"],               atencion:["Presencial"] },
      { cmp:"011482", name:"Ponce Valdivia Silvia Ximena",  specialty:"Ginecología",      sedes:["San Borja","La Molina"], atencion:["Virtual"] },
      { cmp:"047736", name:"Llerena Bustios Diego Alonso",  specialty:"Dermatología",     sedes:["Lima","Surco"],       atencion:["Presencial"] },
      { cmp:"029815", name:"Gonzales Paredes María Luisa",  specialty:"Cardiología",      sedes:["San Isidro"],         atencion:["Presencial","Virtual"] },
      { cmp:"056432", name:"Delgado Sánchez Luis Ángel",    specialty:"Medicina Interna", sedes:["La Molina","Lima"],   atencion:["Presencial"] },
      { cmp:"033241", name:"Arredondo Vega Patricia Elena", specialty:"Psiquiatría",      sedes:["Surco","San Borja"],  atencion:["Virtual"] },
      { cmp:"018374", name:"Salinas Quispe Eduardo Renzo",  specialty:"Neurología",       sedes:["Lima","San Isidro"],  atencion:["Presencial","Virtual"] },
    ];

    const PAGE_SIZE = 12;
    let currentPage = 1;
    let filtered = [...DOCTORS];

    // Populate specialty filter
    const specialties = [...new Set(DOCTORS.map(d => d.specialty))].sort();
    const sel = document.getElementById('specialtyFilter');
    specialties.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      sel.appendChild(opt);
    });

    function applyFilters() {
      currentPage = 1;
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      const sp = document.getElementById('specialtyFilter').value;
      const pres = document.getElementById('presencial').checked;
      const virt = document.getElementById('virtual').checked;
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

    function avatarSVG() {
      return `<div class="placeholder">
        <svg viewBox="0 0 80 80"><circle cx="40" cy="28" r="18"/><ellipse cx="40" cy="72" rx="28" ry="20"/></svg>
      </div>`;
    }

    function render() {
      const grid = document.getElementById('grid');
      const total = filtered.length;
      const start = (currentPage - 1) * PAGE_SIZE;
      const page = filtered.slice(start, start + PAGE_SIZE);

      document.getElementById('resultsCount').textContent =
        `Mostrando ${start + 1}-${Math.min(start + PAGE_SIZE, total)} de ${total} médicos`;

      grid.innerHTML = page.map((d, i) => `
        <div class="card" style="animation-delay:${i * 40}ms">
          <div class="card-photo">${avatarSVG()}</div>
          <div class="card-body">
            <div class="cmp">CMP: ${d.cmp}</div>
            <div class="card-name">${d.name}</div>
            <div class="card-specialty">${d.specialty}</div>
            <a class="conoce-mas" href="#">Conoce más</a>
          </div>
        </div>
      `).join('');

      renderPagination(total);
    }

    function renderPagination(total) {
      const pages = Math.ceil(total / PAGE_SIZE);
      const el = document.getElementById('pagination');
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