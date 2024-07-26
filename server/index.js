import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import nodemailer from 'nodemailer';

import initDatabase from './models/initDatabase/initDatabase.js';
import authRoutes from './routes/auth/AuthRoute.js';
import inviteRoute from './routes/invite/inviteRoute.js';
import productRoutes from './routes/product/ProductRoute.js';
import roleRoutes from './routes/role/RoleRoute.js';
import SidebarRoute from './routes/sidebar/sidebarRoute.js';
import MemberRoute from './routes/team/TeamRoute.js';
import teamMembersRoutes from './routes/team_members/teamMembersRoutes.js';
import userRoutes from './routes/user/UserRoute.js';

dotenv.config();

const app = express();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(express.json());
app.use(
  cors({
    origin: ['http://37.60.244.17:3000'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/api', teamMembersRoutes);
app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/api', userRoutes);
app.use('/', MemberRoute);
app.use('/roles', roleRoutes);
app.use('/api', inviteRoute);
app.use('/', SidebarRoute);

app.post('/send-email', (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({ status: 'error', error: 'Email is required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Invitation to Join',
    text: 'You are invited to join our platform.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ status: 'error', error: error.message });
    } else {
      return res.status(200).json({ status: 'success', info });
    }
  });
});

initDatabase().then(() => {
  app.listen(8082, () => {
    console.log('Server is running on port 8082');
  });
});
