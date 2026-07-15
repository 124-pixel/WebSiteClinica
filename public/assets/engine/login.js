document.getElementById('contrasena').addEventListener('keydown', e => {
  if (e.key === 'Enter') login();
});

async function login() {
  const correo = document.getElementById('correo').value.trim();
  const contrasena = document.getElementById('contrasena').value;
  const recordar = document.getElementById('recordar').checked;
  const btn = document.getElementById('btnLogin');
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.classList.remove('show');

  if (!correo || !contrasena) {
    mostrarError('Por favor completa todos los campos.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Ingresando...';

  try {
    // 1. Intenta como paciente / administrador
    const intentoUsuario = await intentarLogin('http://localhost:3000/api/login', correo, contrasena);

    if (intentoUsuario.ok) {
      const storage = recordar ? localStorage : sessionStorage;
      storage.setItem('token', intentoUsuario.data.token);
      storage.setItem('usuario', JSON.stringify(intentoUsuario.data.usuario));

      const rol = intentoUsuario.data.usuario.rol;
      if (rol === 'Administrador') {
        window.location.href = '../admin/homeAdmin.html';
      } else if (rol === 'Paciente') {
        window.location.href = '../usuario/homeUsuario.html';
      } else {
        mostrarError('Rol no reconocido. Contacte a administración.');
      }
      return;
    }

    // 2. Si no fue paciente/admin, intenta como médico
    const intentoMedico = await intentarLogin('http://localhost:3000/api/login-medico', correo, contrasena);

    if (intentoMedico.ok) {
      const storage = recordar ? localStorage : sessionStorage;
      storage.setItem('token', intentoMedico.data.token);
      storage.setItem('medico', JSON.stringify(intentoMedico.data.usuario));
      window.location.href = '../medico/homeMedico.html';
      return;
    }

    // 3. Ninguno de los dos funcionó
    mostrarError(intentoUsuario.data.error || intentoMedico.data.error || 'Correo o contraseña incorrectos.');

  } catch (err) {
    mostrarError('No se pudo conectar con el servidor.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Iniciar sesión';
  }
}

async function intentarLogin(url, correo, contrasena) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { error: 'No se pudo conectar con el servidor.' } };
  }
}

function mostrarError(msg) {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = msg;
  errorMsg.classList.add('show');
}