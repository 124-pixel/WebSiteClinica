// Favicon automático en todas las páginas
const favicon = document.createElement('link');
favicon.rel   = 'icon';
favicon.type  = 'image/png';
favicon.href  = '/public/assets/imgHome/favicon-removebg-preview.png';
document.head.appendChild(favicon);

const navbarHTML = `
<header class="navbar">
    <div class="logo">
        <a href="home.html"> 
            <img src="https://clinicainternacional.com.pe/assets/logos/logo.png" alt="Logo de Care Link">
        </a>
    </div>

    <nav>
        <ul>
            <li><a href="home.html">Inicio</a></li>
            <li><a href="especialidades.html">Especialidades</a></li>
            <li><a href="promos.html">Promociones</a></li>
            <li><a href="diagnosticos.html">Centro de Diagnostico</a></li>
        </ul>
    </nav>

    <div class="nav-extra">
        <a href="Login.html" class="boton-cita">Agendar cita</a>
    </div>
</header>
`;

document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("navbar-container");
    if (contenedor) {
        contenedor.innerHTML = navbarHTML;
    } else {
        console.warn("No se encontró el contenedor #navbar-container para el navbar.");
    }
});