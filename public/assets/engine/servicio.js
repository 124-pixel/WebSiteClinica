const SERVICIOS = [
      {
    categoria: "medica", // ◄ Cambiado de "todos" a "medica"
    nombre: "Médico Virtual",
    img: "../assets/imgServicios/servicio_medicovirtual_cc_9e471a79f1.webp",
    desc: "Recibe atención médica de manera segura y rápida desde donde estés...",
    lista: ["Atención desde cualquier lugar.", "Reserva fácil por web, app o teléfono.", "Recetas y seguimiento médico online."],
    agendar: true
  },
  {
    categoria: "medica", // ◄ Cambiado de "todos" a "medica"
    nombre: "Atención a domicilio",
    img: "../assets/imgServicios/servicio_atenciondomicilio_8b6fc50594.webp",
    desc: "Disfruta de atención médica especializada en la comodidad de tu hogar...",
    lista: ["Diagnóstico y tratamiento en casa.", "Reservas por web, app o llamada.", "Atención en zonas específicas de Lima."],
    agendar: false
  },
  {
    categoria: "medica", // ◄ Cambiado de "todos" a "medica"
    nombre: "Hospitalización domiciliaria",
    img: "../assets/imgServicios/Hospitalizacion_domiciliaria_2aed164b08.webp",
    desc: "Nuestro programa de Hospitalización Domiciliaria lleva la atención hospitalaria completa a tu hogar...",
    lista: ["Monitoreo médico y terapias.", "Soporte multidisciplinario 24/7.", "Coordinación con tu seguro o servicio particular."],
    agendar: true
  },
      {
        categoria: "prevencion",
        nombre: "Chequeos Preventivos",
        img: "../assets/imgServicios/CHEQUEO_PREVENTIVO_1_9cf76fc324.webp",
        desc: "Mantén tu salud bajo control con nuestros paquetes de chequeo médico completo. Detecta a tiempo cualquier condición y toma el control de tu bienestar.",
        lista: ["Más de 30 exámenes incluidos.", "Evaluación con especialistas.", "Resultados en 48 horas."],
        agendar: true
      },
      {
        categoria: "maternidad",
        nombre: "Programa de Maternidad",
        img: "../assets/imgServicios/servicio_programadematernidad_0bdab53e50.jpg",
        desc: "Acompañamos tu embarazo con paquetes especializados para cada trimestre, brindando el cuidado que tú y tu bebé merecen.",
        lista: ["Paquetes por trimestre.", "Control prenatal completo.", "Ecografías y laboratorios incluidos."],
        agendar: true
      },
      {
        categoria: "laboratorio",
        nombre: "Laboratorio Clínico",
        img: "../assets/imgServicios/LABORATORIO_d7e7f6e456.webp",
        desc: "Contamos con un laboratorio de alta tecnología para análisis clínicos precisos y resultados rápidos disponibles de forma digital.",
        lista: ["Resultados en menos de 24 horas.", "Toma de muestra a domicilio.", "Acceso digital a tus resultados."],
        agendar: false
      },
      {
        categoria: "imagenes",
        nombre: "Centro de Imágenes",
        img: "../assets/imgServicios/servicios_cdi_2552854120.webp",
        desc: "Diagnóstico por imágenes con tecnología de vanguardia: tomografías, resonancias, ecografías y rayos X con interpretación inmediata.",
        lista: ["Tomografía y resonancia magnética.", "Ecografías de todas las especialidades.", "Mamografías 3D."],
        agendar: true
      },
      {
        categoria: "dental",
        nombre: "Sonrisa Total",
        img: "../assets/imgServicios/SONRISA_TOTAL_1_78b1422a2f.webp",
        desc: "Servicios odontológicos completos para toda la familia, desde limpiezas hasta ortodoncia e implantes dentales.",
        lista: ["Limpieza y profilaxis dental.", "Ortodoncia y blanqueamiento.", "Implantes dentales."],
        agendar: true
      },
      {
        categoria: "estetico",
        nombre: "Centro Estético",
        img: "../assets/imgServicios/CENTRO_ESTETICO_ad199c3515.webp",
        desc: "Tratamientos estéticos médicos seguros y efectivos para realzar tu belleza natural con el respaldo de especialistas certificados.",
        lista: ["Toxina botulínica y rellenos.", "Tratamientos faciales y corporales.", "Medicina regenerativa."],
        agendar: true
      },
    ];

    // 1. Ahora por defecto la página arranca mostrando solo la categoría médica
let categoriaActual = 'medica'; 

function filtrarServicios(cat, el) {
  categoriaActual = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderServicios();
}

// 2. Simplificamos el renderizado para que filtre de forma directa y estricta
function renderServicios() {
  const grid = document.getElementById('servicios-grid');
  
  // Filtra de forma directa por la propiedad exacta de la tarjeta
  const lista = SERVICIOS.filter(s => s.categoria === categoriaActual);

  grid.innerHTML = lista.map(s => `
    <div class="servicio-card">
      <div class="servicio-img">
        ${s.img ? `<img src="${s.img}" alt="${s.nombre}" />` : `<span class="img-ph">🏥</span>`}
      </div>
      <div class="servicio-body">
        <div class="servicio-nombre">${s.nombre}</div>
        <p class="servicio-desc">${s.desc}</p>
        <ul class="servicio-lista">
          ${s.lista.map(l => `<li>${l}</li>`).join('')}
        </ul>
        <div class="servicio-btns">
          <a href="#" class="btn-conoce">Conoce más</a>
          ${s.agendar ? `<a href="../views/home.html" class="btn-agendar">Agendar cita</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}
    

    function switchFaq(id, el) {
      document.querySelectorAll('.faq-content').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('faq-' + id).classList.add('active');
      el.classList.add('active');
    }

    function toggleFaq(btn) {
      const item = btn.parentElement;
      // Cerrar otros abiertos del mismo contenedor
      item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(i => {
        if (i !== item) i.classList.remove('open');
      });
      item.classList.toggle('open');
    }

    renderServicios();