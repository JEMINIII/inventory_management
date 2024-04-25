// // require('dotenv').config();
// // const express = require('express');
// // const mysql = require('mysql2');
// // const bodyParser = require('body-parser');

// // const app = express();
// // const port = 8000;

// // const db = mysql.createConnection({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME
// // });

// // db.connect((err) => {
// //   if (err) {
// //     console.error('Error connecting to database:', err);
// //     return;
// //   }
// //   console.log('Connected to database');
// // });

// // app.use(bodyParser.urlencoded({ extended: true }));
// // app.use(bodyParser.json());

// // app.get("/", (req, res) => {
// //   res.send(`<h1>Hello!</h1>`);
// // });

// // app.listen(port, () => {
// //   console.log(`Application is listening at port ${port}`);
// // });



// import express from "express";
// import cors from "cors";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import { check, validationResult } from "express-validator";
// import multer from "multer";
// import path from "path";
// import { db } from "./models/db/DbModel.js";
// // import { createPool } from 'mysql2/promise';

// // import authRoutes from "./Routes/authRoutes.js";
// // import userRoutes from "./Routes/useRoutes.js";
// // import productRoute from "./Routes/productRoutes.js";

// // import { handleRead } from "./Routes/auth.js";

// const salt = 10;
// const app = express();
// app.use(express.json());

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["POST", "GET", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
// app.use(express.static("public"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage: storage,
// });

// app.use(cookieParser());
// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       maxAge: 1000 * 60 * 60 * 24,
//     },
//   })
// );

// // app.use("/auth", authRoutes);
// // app.use("/products", productRoute);

// const verifyUser = (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return res.json({ Error: "You are not authenticated" });
//   } else {
//     jwt.verify(token, "jwt-secret-key", (err, decoded) => {
//       if (err) {
//         return res.json({ Error: "Token is not ok" });
//       } else {
//         req.name = decoded.name;
//         next();
//         // console.log(req.name)
//       }
//     });
//   }
// };

// app.get("/", verifyUser, async (req, res) => {
//   try {
//     const q = "SELECT product_id, product_name, price, quantity, total_amount FROM inventory";
//     const result = await db.promise().query(q);
    
//     res.status(200).json({ Status: "success", name: req.name, inventory: result[0] });
//   } catch (error) {
//     console.error("Error inside server:", error);
//     res.status(500).json({ Message: "Error inside server" });
//   }
// });


// // app.get("/", verifyUser, handleRead);

// app.post("/register", async (req, res) => {
//   try {
//     const q = "INSERT INTO user (`name`,`email`,`password`) VALUES (?)";

//     const hash = await bcrypt.hash(req.body.password.toString(), salt);
//     const values = [req.body.name, req.body.email, hash];

//     await db.query(q, [values]);
    
//     res.json({ Status: "success" });
//   } catch (error) {
//     console.error("Error inside server:", error);
//     res.status(500).json({ Error: "Internal server error" });
//   }
// });


// app.post(
//   "/login",
//   [
//     check("email", "Email is invalid or length is not between 10 and 30 characters").isEmail().isLength({ min: 10, max: 30 }),
//     check("password", "Password length must be between 8 and 10 characters").isLength({ min: 8, max: 10 }),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json({ errors: errors.array() });
//       }

//       const q = "SELECT * FROM user WHERE email = ?";
//       const [rows] = await pool.promise().query(q, [req.body.email]);

//       if (rows.length === 0) {
//         return res.json({ Error: "No email exists" });
//       }

//       const match = await bcrypt.compare(req.body.password.toString(), rows[0].password);
//       if (match) {
//         const token = jwt.sign({ name: rows[0].name }, process.env.JWT_SECRET, { expiresIn: "1d" });
//         res.cookie("token", token);
//         req.session.name = rows[0].name;
//         return res.json({ Status: "success", name: req.session.name });
//       } else {
//         return res.json({ Error: "Password does not match" });
//       }
//     } catch (error) {
//       console.error("Error inside server:", error);
//       return res.status(500).json({ Error: "Internal server error" });
//     }
//   }
// );


// app.get("/logout", async (req, res) => {
//   try {
//     res.clearCookie("token");
//     return res.json({ Status: "success" });
//   } catch (error) {
//     console.error("Error inside server:", error);
//     return res.status(500).json({ Message: "Error inside server" });
//   }
// });

// app.post("/create", upload.single("image"), async (req, res) => {
//   try {
//     const q =
//       "INSERT INTO inventory (`product_name`,`category`,`price`,`quantity`,`total_amount`, `images`) VALUES (?)";
//     const values = [
//       req.body.product_name,
//       req.body.category,
//       req.body.price,
//       req.body.quantity,
//       req.body.total_amount,
//       req.file.filename, // Assuming req.file.filename contains the uploaded image filename
//     ];

//     const result = await pool.query(q, [values]);
//     console.log(result);
//     return res.json(result);
//   } catch (error) {
//     console.error("Error inside server:", error);
//     return res.json({ Message: "Error inside server" });
//   }
// });

// app.get("/read/:product_id", async (req, res) => {
//   try {
//     const q = "SELECT * FROM inventory WHERE product_id = ?";
//     const id = req.params.product_id;

//     const [result] = await pool.query(q, [id]);

//     if (result.length > 0) {
//       const { images, ...productData } = result[0];
//       const imageBufferData = images;
//       // const blobUrl = URL.createObjectURL(new Blob([imageBufferData],{ type: 'image/jpg' }));
//       const blobUrl = `http://localhost:8082/images/${imageBufferData}`;
//       const productWithBlobUrl = { ...productData, image: blobUrl };
//       return res.json(productWithBlobUrl);
//     } else {
//       return res.status(404).json({ Message: "Product not found" });
//     }
//   } catch (error) {
//     console.error("Error inside server:", error);
//     return res.status(500).json({ Message: "Error inside server" });
//   }
// });

// app.put("/edit/:product_id", async (req, res) => {
//   try {
//     const q =
//       "UPDATE inventory SET `product_name`=?, `category`=?, `price`=?, `quantity`=?, `total_amount`=? WHERE product_id=?";
//     const { product_id } = req.params;
//     const { product_name, category, price, quantity, total_amount } = req.body;

//     const [result] = await pool.query(q, [
//       product_name,
//       category,
//       price,
//       quantity,
//       total_amount,
//       product_id,
//     ]);
//     res.json({ Message: "Success" });
//   } catch (error) {
//     console.error("Error inside server:", error);
//     res.status(500).json({ Message: "Error inside server" });
//   }
// });

// app.delete("/delete/:id", async (req, res) => {
//   try {
//     const q = "DELETE FROM inventory WHERE product_id = ?";
//     const { id } = req.params;
//     const result = await new Promise((resolve, reject) => {
//       db.query(q, [id], (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(result);
//       });
//     });

//     res.json(result);
//   } catch (err) {
//     console.error("Error deleting product:", err);
//     res.status(500).json({ error: "Failed to delete product" });
//   }
// });

// app.get("/sidebar", async (req, res) => {
//   try {
//     const q = "SELECT * FROM menu";
//     const result = await new Promise((resolve, reject) => {
//       db.query(q, (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(result);
//       });
//     });

//     const formattedMenuItems = result.map((item) => ({
//       id: item.id,
//       label: item.label,
//       icon: item.icon,
//       route: item.route,
//       parent_id: item.parent_id,
//     }));

//     res.json(formattedMenuItems);
//   } catch (err) {
//     console.error("Error fetching menu items:", err);
//     res.status(500).json({ error: "Failed to fetch menu items" });
//   }
// });

// app.listen(8082, () => {
//   console.log("listening");
// });


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import authRoutes from "./routes/auth/AuthRoute.js";
import productRoutes from "./routes/product/ProductRoute.js";
import db from "./models/db/DbModel.js";
const app = express();
import userRoutes from "./routes/user/UserRoute.js"

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));



app.use("/", authRoutes);
app.use("/products", productRoutes);
app.use('/api', userRoutes);

app.get("/sidebar", async (req, res) => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM menu");
    
    const formattedMenuItems = rows.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      route: item.route,
      parent_id: item.parent_id,
    }));

    res.json(formattedMenuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});



app.listen(8082, () => {
  console.log("Server is running on port 8082");
});