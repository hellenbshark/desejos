import mysql from 'mysql2/promise';

// Configuração do pool de conexões
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Halo1756?!',
  database: 'wishlist_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
