import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import nodemailer from 'nodemailer';
import passport from 'passport';

import initDatabase from './models/initDatabase/initDatabase.js';
import authRoutes from './routes/auth/AuthRoute.js';
import googleAuthRoute from './routes/auth/googleAuthRoute.js';
import organizationRoutes from './routes/data/DataRoute.js';
import inviteRoute from './routes/invite/inviteRoute.js';
import productRoutes from './routes/product/ProductRoute.js';
import roleRoutes from './routes/role/RoleRoute.js';
import SidebarRoute from './routes/sidebar/sidebarRoute.js';
import MemberRoute from './routes/team/TeamRoute.js';
import teamMembersRoutes from './routes/team_members/teamMembersRoutes.js';
import userRoutes from './routes/user/UserRoute.js';

dotenv.config();


initDatabase();
// const express = require('express');
// const cors = require('cors');
const app = express();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const Api_cors = process.env.Api_cors;

app.use(express.json());

const corsOptions = {
  origin: `${Api_cors}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use(express.static('public'));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'none'
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
app.use('/', organizationRoutes);

app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);
app.use(googleAuthRoute)
// Express.js example
// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//   next();
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (change to specific origin if needed)
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next(); // Don't forget to call next() to pass control to the next middleware
// });
// app.options('*', cors());
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
