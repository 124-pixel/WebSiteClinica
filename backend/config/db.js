const sql = require('mssql');

const config = {
  server: 'LAPTOP-4FU49GED\\SQLEXPRESS',
  database: 'clinica_citas',
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'LAPTOP-4FU49GED',
      userName: 'Giofrank',
      password: 'luis123@'
    }
  },
  options: {
    trustServerCertificate: true,
    port: 1433,
  },
  requestTimeout: 30000,   // ← agrega esta línea
  connectionTimeout: 300005
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log(' Conectado a SQL Server - clinica_citas');
    return pool;
  })
  .catch(err => {
    console.error(' Error de conexión:', err.message);
    process.exit(1);
  });

module.exports = { sql, poolPromise };