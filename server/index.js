import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import https from 'https';
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
import clientsRoutes from './routes/clients/clientsRoute.js'
import chalanRoute from './routes/chalan/chalanRoute.js'

dotenv.config();


initDatabase();
// const express = require('express');
// const cors = require('cors');
const app = express();


// Load SSL certificates from the Certbot directory
const privateKey = fs.readFileSync('/etc/letsencrypt/live/stockzen.in/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/stockzen.in/fullchain.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/stockzen.in/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const Api_cors = process.env.Api_cors;
// Define allowed origins
const allowedOrigins = [
  'http://stockzen.in',      // Domain
  'http://app.stockzen.in',  // Subdomain
  'https://stockzen.in',
  'https://www.stockzen.in',
  'wss://stockzen.in',
  `${Api_cors}` // IP address with port
];


app.use(express.json());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials:true,
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
app.use('/api', clientsRoutes);
app.use('/', chalanRoute);
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
app.options('*', cors());
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

// Create an HTTPS server with the SSL credentials
https.createServer(credentials, app).listen(8082, () => {
  console.log('HTTPS server is running on port 8082');
});
