import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import db from '../../models/db/DbModel.js';  // Import your db module

// Your Google client ID and secret from the Google Developer Console
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// JWT secret key
const JWT_SECRET = 'your-jwt-secret';

// Set up Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user's email is present in the database
      const emailQuery = "SELECT * FROM users WHERE email = ?";
      const [emailResult] = await db.query(emailQuery, [profile.emails[0].value]);

      if (emailResult && emailResult.length > 0) {
        // If the email is found, pass the user profile to the next step
        done(null, profile);
      } else {
        // If the email is not found, handle it (e.g., redirect to signup)
        return done(null, false, { message: "Email not registered. Please sign up." });
      }
    } catch (error) {
      console.error("Error checking email:", error);
      return done(error);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user out of the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Handle the Google OAuth callback
export const googleAuthCallback = (req, res) => {
  // Issue a JWT after successful Google login
  const token = jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: '1h' });

  // Set the token in a cookie or pass it in the response
  res.cookie('token', token, { httpOnly: true, secure: false }); // secure: true in production

  // Redirect to frontend
  res.redirect('http://localhost:3000'); // Update this to your frontend URL
};

// Route for Google login
export const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// Route for Google login callback
export const googleLoginCallback = [
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  googleAuthCallback
];
