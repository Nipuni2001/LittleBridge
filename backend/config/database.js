const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'littlebridge_db',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log(' Database connected to:', process.env.DB_NAME || 'littlebridge_db');
    conn.release();
  })
  .catch(err => {
    console.error(' Database connection FAILED:');
    console.error(`   Host:     ${process.env.DB_HOST || 'localhost'}`);
    console.error(`   Port:     ${process.env.DB_PORT || '3306'}`);
    console.error(`   Database: ${process.env.DB_NAME || 'littlebridge_db'}`);
    console.error(`   User:     ${process.env.DB_USER || 'root'}`);
    console.error(`   Error:    ${err.message}`);
    console.error('\n   Check your backend/.env DB_* variables\n');
  });

module.exports = pool;
