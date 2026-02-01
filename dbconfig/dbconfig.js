const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true
});

// Test the connection
pool.getConnection()
  .then(conn => {
    console.log(` MySQL Connected: ${conn.config.host}`);
    conn.release();
  })
  .catch(err => {
    console.error(` MySQL connection error: ${err.message}`);
    process.exit(1);
  });

module.exports = pool;
