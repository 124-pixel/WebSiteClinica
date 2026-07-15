// Este es el objeto/array con la base de datos de todas tus promociones actuales
const promociones = {
    "primer-trimestre": {
        titulo: "Primer Trimestre",
        imagen: "../assets/imgPromociones/PRIMER_TRIMESTRE_5_97a3b494d3.webp",
        descripcion: "Cuidamos de tu embarazo en esta nueva etapa realizando un seguimiento integral para tu bebé desde el primer día, paquete exclusivo para la sede Lima.",
        beneficios: [
            "2 Consultas pre-natales",
            "1 Ecografía del 1er trimestre",
            "1 Perfil prenatal: Examen de laboratorio que incluye hemograma, glucosa, creatinina, examen completo de orina, grupo sanguíneo y factor RH, RPR y HIV."
        ],
        precio: "S/ 374"
    },
    "segundo-trimestre": {
        titulo: "Segundo Trimestre",
        imagen: "../assets/imgPromociones/SEGUNDO_TRIMESTRE_815298706b.webp",
        descripcion: "Continuamos acompañándote en el desarrollo intermedio de tu embarazo, monitoreando el crecimiento de tu bebé con total seguridad y el respaldo de nuestros especialistas.",
        beneficios: [
            "Consultas de control obstétrico especializadas",
            "Monitoreo ecográfico del desarrollo fetal",
            "Evaluaciones clínicas periódicas recomendadas para el segundo trimestre"
        ],
        precio: "S/ 485"
    },
    "tercer-trimestre": {
        titulo: "Tercer Trimestre",
        imagen: "../assets/imgPromociones/TERCER_TRIMESTRE_1_cd734f2c98.webp",
        descripcion: "Llegamos a la etapa final listos para brindarte la máxima tranquilidad y los exámenes necesarios previos al momento del parto.",
        beneficios: [
            "Consultas pre-natales finales de seguimiento estricto",
            "Monitoreo fetal continuo para evaluar el bienestar de tu bebé",
            "Evaluaciones pre-quirúrgicas o exámenes requeridos para el nacimiento"
        ],
        precio: "S/ 680"
    },
    "segunda-opinion": {
        titulo: "Segunda Opinión Médica",
        imagen: "../assets/imgPromociones/460x260px_056ffd6da8.webp",
        descripcion: "Obtén una evaluación adicional de nuestros especialistas para confirmar tu diagnóstico y tomar la mejor decisión para tu salud.",
        beneficios: [
            "Evaluación completa de tu historial clínico actual por un médico especialista",
            "Revisión y validación de exámenes de diagnóstico previos",
            "Orientación personalizada sobre las mejores alternativas de tratamiento disponibles"
        ],
        precio: "GRATIS"
    },
    "cirugia-robotica": {
        titulo: "Cirugía Robótica",
        imagen: "../assets/imgPromociones/CARD_600x339_b32b5a5ab2.webp",
        descripcion: "Descubre si tu cirugía puede beneficiarse con esta tecnología. Conoce los grandes beneficios de la cirugía robótica, una alternativa de mínima invasión con precisión milimétrica.",
        beneficios: [
            "Consulta de evaluación de elegibilidad para procedimiento robótico",
            "Explicación detallada de la tecnología de mínima invasión y tiempos de recuperación",
            "Plan de abordaje quirúrgico personalizado por cirujanos certificados"
        ],
        precio: "S/ 290"
    },
    "cirugia-traumatologia": {
        titulo: "Cirugías en Traumatología",
        imagen: "../assets/imgPromociones/Card_promocional_976b135c96.webp",
        descripcion: "La recuperación que necesitas, con el respaldo que mereces. Accede a beneficios desde el 17% de descuento en tu cirugía artroscópica de hombro o rodilla.",
        beneficios: [
            "Evaluación traumatológica especializada previa al procedimiento",
            "Acceso directo a tarifas preferenciales y hasta un 17% de descuento en quirófano",
            "Seguimiento y recomendaciones del equipo médico para una óptima rehabilitación posterior"
        ],
        precio: "S/ 0 (Consultar tarifas)"
    },
    "cirugia-bariatrica": {
        titulo: "Cirugía Bariátrica",
        imagen: "../assets/imgPromociones/Card_promocional_copia_1_adb2d23913.webp",
        descripcion: "Cambiar tu vida va más allá de una operación. Accede a un 35% de descuento y una consulta inicial por S/149 en tu cirugía bariátrica.",
        beneficios: [
            "Consulta de evaluación médica inicial a precio preferencial de S/149",
            "Descuento exclusivo del 35% aplicado al procedimiento de cirugía bariátrica seleccionado",
            "Asesoría integral y acompañamiento médico multidisciplinario durante el proceso"
        ],
        precio: "S/ 0 (Consultar paquetes)"
    }
};

// Función para inicializar y cargar los datos dinámicos en 'detalle-promos.html'
function cargarPromocion() {
    const urlParams = new URLSearchParams(window.location.search);
    let idPromocion = urlParams.get('id');

    // Por si acaso, si no hay ID o el ID está mal escrito, ponemos una por defecto
    if (!idPromocion || !promociones[idPromocion]) {
        idPromocion = "primer-trimestre"; 
    }

    const data = promociones[idPromocion];

    // Modificar los textos y elementos del DOM en la plantilla de detalle
    document.getElementById("current-breadcrumb").textContent = data.titulo;
    document.title = `${data.titulo} | Promociones`;
    document.getElementById("promo-title").textContent = data.titulo;
    document.getElementById("promo-desc").textContent = data.descripcion;
    document.getElementById("promo-price").textContent = data.precio;
    document.getElementById("promo-img").src = data.imagen;

    // Limpiar y renderizar la lista de beneficios dinámicamente
    const listaBeneficios = document.getElementById("promo-benefits");
    if (listaBeneficios) {
        listaBeneficios.innerHTML = ""; 
        data.beneficios.forEach(beneficio => {
            const li = document.createElement("li");
            li.textContent = beneficio;
            listaBeneficios.appendChild(li);
        });
    }
}

// Escuchar el evento de envío del formulario
const formulario = document.getElementById("promo-form");
if (formulario) {
    formulario.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("¡Solicitud enviada con éxito! Muy pronto un asesor se pondrá en contacto contigo.");
    });
}

// Lanzar la carga cuando la página esté lista
window.addEventListener("DOMContentLoaded", cargarPromocion);