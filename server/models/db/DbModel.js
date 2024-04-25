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

// // export {db};

// import mysql from "mysql2";

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to database');
// });

export default db;
