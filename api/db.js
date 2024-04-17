// db.js

import mysql from "mysql2";


const pool =  mysql.createPool({
  host: "localhost",
  user: "root",
  password: "jemini@#123",
  database: "stock_management",waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();
const db = pool

export {db};
