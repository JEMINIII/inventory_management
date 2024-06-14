
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import nodemailer from "nodemailer";
import authRoutes from "./routes/auth/AuthRoute.js";
import productRoutes from "./routes/product/ProductRoute.js";
import MemberRoute from "./routes/team/TeamRoute.js";
import userRoutes from "./routes/user/UserRoute.js";
import db from "./models/db/DbModel.js";
import { verifyUser } from "./controllers/auth/AuthController.js";
import roleRoutes from './routes/role/RoleRoute.js'
const app = express();
const router = express.Router();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ensure this is set in your .env file
    pass: process.env.EMAIL_PASS  // Ensure this is set in your .env file
  }
});



app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3001"],
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
app.use('/', MemberRoute);
app.use('/roles', roleRoutes)
app.post('/send-email', (req, res) => {
  const { email } = req.body;
  console.log(email)
  if (!email) {
    return res.status(400).json({ status: 'error', error: 'Email is required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invitation to Join',
    text: 'You are invited to join our platform.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);  // Log the detailed error
      return res.status(500).json({ status: 'error', error: error.message });
    } else {
      return res.status(200).json({ status: 'success', info });
    }
  });
});
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


