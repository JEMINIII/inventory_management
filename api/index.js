import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import session from "express-session";
import { check, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import db from "./db.js";
import authRoutes from "./Routes/authRoutes.js";
// import userRoutes from "./Routes/useRoutes.js";
import productRoute from "./Routes/productRoutes.js";
import verifyUser from "./middlewares/authmiddleware.js";
// import { handleRead } from "./Routes/auth.js";

const salt = 10;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/auth", authRoutes);
app.use("/products", productRoute);

app.get("/sidebar", async (req, res) => {
  try {
    const q = "SELECT * FROM menu";
    db.query(q, (err, result) => {
      if (err) {
        console.error("Error fetching menu items:", err);
        return res.status(500).json({ error: "Failed to fetch menu items" });
      }

      const formattedMenuItems = result.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        route: item.route,
        parent_id: item.parent_id,
      }));

      res.json(formattedMenuItems);
      // console.log(formattedMenuItems)
    });
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

app.listen(8082, () => {
  console.log("listening");
});
