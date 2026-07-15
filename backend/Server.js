console.log('Iniciando servidor...');
process.on('uncaughtException', err => console.error('ERROR:', err.message));

const express           = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas peticiones, intenta más tarde.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de login, espera 15 minutos.' }
});
const cors              = require('cors');
const path              = require('path');
const jwt               = require('jsonwebtoken');
const { sql, poolPromise } = require('./config/Db');
const CitaController    = require('./controllers/CitasController');
const MedicoController  = require('./controllers/MedicosController');
const SedesController   = require('./controllers/SedesController');
const AuthController    = require('./controllers/AuthController'); // <-- AGREGA ESTA LÍNEA

const app    = express();
const PORT   = 3000;
const SECRET = 'clinica_secret_2024';

app.use(cors());
app.use(helmet());
app.use('/api/', limiter);
app.use('/api/login', loginLimiter);
app.use(express.json());


//LOGIN
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query(`
        SELECT u.id, u.nombre, u.correo, u.contrasena, u.estado,
               r.nombre_rol
        FROM dbo.usuarios u
        LEFT JOIN dbo.roles r ON u.id_rol = r.id
        WHERE u.correo = @correo
      `);

    const usuario = result.recordset[0];
    if (!usuario || contrasena !== usuario.contrasena)
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.nombre_rol },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.nombre_rol }
    });
  } catch (err) {
    console.error('Error en /api/login:', err.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});
app.post('/api/login-medico', (req, res) => AuthController.loginMedico(req, res));
//RUTAS ESPECIALIDADES Y MÉDICOS 
app.get('/api/especialidades',       (req, res) => MedicoController.getEspecialidades(req, res));
app.get('/api/medicos',              (req, res) => MedicoController.getMedicos(req, res));
app.get('/api/medicos/:id/horarios', (req, res) => MedicoController.getHorarios(req, res));
app.get('/api/citas/medico/:id', (req, res) => CitaController.getCitasMedico(req, res));
app.get('/api/citas/usuario/:id',    (req, res) => CitaController.getCitasUsuario(req, res));
// RUTAS CITAS
app.post('/api/citas',               (req, res) => CitaController.createCita(req, res));
app.get('/api/citas/hoy',            (req, res) => CitaController.getCitasHoy(req, res));
app.get('/api/citas/usuario/:id',    (req, res) => CitaController.getCitasUsuario(req, res));
app.patch('/api/citas/:id/estado',   (req, res) => CitaController.updateEstado(req, res));
app.patch('/api/citas/:id/resultado', (req, res) => CitaController.updateResultado(req, res));
// agrega esto con las otras rutas
app.get('/api/sedes', (req, res) => SedesController.getSedes(req, res));

// RUTA PARA QUE EL ADMIN REGISTRE PACIENTES <-- AGREGA ESTA NUEVA RUTA
// 1. Esta ya funciona bien para registrar:
app.post('/api/usuarios/pacientes', (req, res) => AuthController.registrarPaciente(req, res));

// 2. ESTA ES LA QUE TE FALTA O TIENE UN ERROR (Asegúrate de que use app.get):
app.get('/api/usuarios/pacientes', (req, res) => AuthController.obtenerPacientes(req, res));

app.get('/api/citas/todas', (req, res) => CitaController.getCitasTodas(req, res));
//HEALTH CHECK 
app.get('/api/health', (req, res) => {
  res.json({ ok: true, hora: new Date().toISOString() });
});


app.use(express.static(path.join(__dirname, '../public')));

//INICIAR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}).on('error', err => console.error('Error al iniciar servidor:', err.message));