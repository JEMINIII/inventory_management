// db.js

import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jemini@#123',
  database: 'stock_management',
});

export default db;
