import mysql from "mysql2";

const initialPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "jemini@#123",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

const checkAndCreateDatabase = async () => {
  try {
    
    const [rows] = await initialPool.query("SHOW DATABASES LIKE 'stock_management'");
    if (rows.length === 0) {
      // Create the database if it doesn't exist
      await initialPool.query("CREATE DATABASE stock_management");
      console.log("Database 'stock_management' created successfully.");
    } else {
      console.log("Database 'stock_management' already exists.");
    }
  } catch (error) {
    console.error("Error checking/creating database:", error);
    throw error;
  }
};
await checkAndCreateDatabase();
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "jemini@#123",
  database: "stock_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

const db = pool;

export default db;
