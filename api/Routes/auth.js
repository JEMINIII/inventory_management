import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jemini@#123',
  database: 'stock_management',
});

export default db;

const handleRead = (req, res) => {
    const q = "SELECT product_id, product_name, price, quantity, total_amount FROM inventory";
    db.query(q, (err, result) => {
        if (err) {
            return res.status(500).json({ Message: "Error inside server" });
        }
        return res.status(200).json({ Status: "success", name: req.name, inventory: result });
    });
  };
  
  // Export handleRead function
  export { handleRead };