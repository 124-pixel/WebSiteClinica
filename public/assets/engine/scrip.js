/*Scrip carrusel section*/

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const counter = document.getElementById('counter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateCarousel(direction) {
        // 1. Quitar la clase active del slide actual
        slides[currentIndex].classList.remove('active');

        // 2. Calcular el nuevo índice
        currentIndex += direction;

        // Bucle infinito: si pasa del final va al inicio, si baja de 0 va al final
        if (currentIndex >= slides.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        }

        // 3. Añadir la clase active al nuevo slide
        slides[currentIndex].classList.add('active');

        // 4. Actualizar el contador visual
        counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }

    // Escuchar los clics en los botones
    nextBtn.addEventListener('click', () => updateCarousel(1));
    prevBtn.addEventListener('click', () => updateCarousel(-1));
});


/*service section*/
const datos = [
    {
      titulo: "Tu atención médica del domingo puede sorprenderte",
      texto: "Participa automáticamente por una de las 5 aplicaciones de toxina botulínica.",
      imagen: "https://clinicainternacional.com.pe/uploads/Banner_WEB_72_px_2f4d8334c4.webp"
    },
    {
      titulo: "Cuida tu salud respiratoria",
      texto: "Si sientes molestias al respirar, agenda una cita en neumología y evita complicaciones con una evaluación especializada",
      imagen: "https://clinicainternacional.com.pe/uploads/BANNER_WEB_7_8cebf023ce.webp"
    },
    
   {
  titulo: "Vive los Beauty Days en nuestro centro estético",
  texto: "Disfruta limpieza facial express sin costo, 30% de descuento en productos seleccionados y más sorpresas exclusivas.",
  imagen: "https://clinicainternacional.com.pe/uploads/BD_Banner_Web_1_6fb54ca029.webp"
}
  ];

let index = 0;


  const imagen = document.getElementById("imagen");
  const titulo = document.getElementById("titulo");
  const texto = document.getElementById("texto");
  const siguiente = document.getElementById("siguiente");
  const anterior = document.getElementById("anterior");
  const contador = document.getElementById("contador");

  

  function mostrarDatos(){
    titulo.innerText = datos[index].titulo;
    texto.innerText = datos[index].texto;
    imagen.src  = datos[index].imagen;
    contador.innerText = (index + 1) + "/" + datos.length;
  }

  mostrarDatos();

  siguiente.addEventListener("click" , function(){
    index++;
    if(index >= datos.length){
        index = 0;
    }
    mostrarDatos();
   });

   anterior.addEventListener("click" , function (){
    index--;
    if(index < 0){
        index = datos.length - 1;
    }
    mostrarDatos();

   });

  

   /*especialidades js*/

  function filtrar(categoria){
    const tarjetas = document.querySelectorAll('.tarjeta-medica');
    tarjetas.forEach(tarjeta => {

        const tipo = tarjeta.getAttribute('data-tipo');
        if(categoria === 'todas' || tipo === categoria){

            tarjeta.style.display = "block";
        }else{
            tarjeta.style.display = "none";
        }

            
        
    });        
    
  }


  /*election js*/

  const datosreferencia = [
    {
      texto: "Participa automáticamente por una de las 5 aplicaciones de toxina botulínica.",
      nombre: "Luis Garcia",
      dni: "DNI: 12345678",
      imagen: "https://clinicainternacional.com.pe/uploads/Banner_WEB_72_px_2f4d8334c4.webp"
      
    },
    {
      texto: "Si sientes molestias al respirar, agenda una cita en neumología y evita complicaciones con una evaluación especializada",
      nombre: "María López",
      dni: "DNI:87654321",
      imagen: "https://clinicainternacional.com.pe/uploads/BANNER_WEB_7_8cebf023ce.webp"
    },
    
   {
  texto: "Disfruta limpieza facial express sin costo, 30% de descuento en productos seleccionados y más sorpresas exclusivas.",
  nombre: "Ana Rodríguez",
  dni: "DNI: 11223344",
  imagen: "https://clinicainternacional.com.pe/uploads/BD_Banner_Web_1_6fb54ca029.webp"
}
  ];


  let indexReferencia = 0;

    const textoReferencia = document.getElementById("textoReferencia");
    const nombreReferencia = document.getElementById("nombreReferencia");
    const dniReferencia = document.getElementById("dniReferencia");
    const imagenReferencia = document.getElementById("imagenReferencia");
    const siguienteReferencia = document.getElementById("siguienteReferencia");
    const anteriorReferencia = document.getElementById("anteriorReferencia");
    const contadorReferencia = document.getElementById("contadorReferencia");

    function mostrarDatosReferencia(){
        textoReferencia.innerText = datosreferencia[indexReferencia].texto;
        nombreReferencia.innerText = datosreferencia[indexReferencia].nombre;
        dniReferencia.innerText = datosreferencia[indexReferencia].dni;
        imagenReferencia.src = datosreferencia[indexReferencia].imagen;
        contadorReferencia.innerText = (indexReferencia + 1) + "/" + datosreferencia.length;
    }

    mostrarDatosReferencia();

    siguienteReferencia.addEventListener("click" , function(){
        indexReferencia++;
        if(indexReferencia >= datosreferencia.length){
            indexReferencia = 0;
        }
        mostrarDatosReferencia();
    });

    anteriorReferencia.addEventListener("click" , function (){
        indexReferencia--;
        if(indexReferencia < 0){
            indexReferencia = datosreferencia.length - 1;
        }
        mostrarDatosReferencia();
    });



    /*script para details y summary */
    const details = document.querySelectorAll("details");

details.forEach(detail => {
  detail.addEventListener("click", () => {
    
    details.forEach(item => {
      if(item !== detail){
        item.removeAttribute("open");
      }
    });
  });
});