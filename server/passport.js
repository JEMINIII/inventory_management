import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Environment variables for Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const api_address = process.env.REACT_APP_API_ADDRESS

// Configure the Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `{api_address}/auth/google/callback`, 
    },
    (accessToken, refreshToken, profile, done) => {

      return done(null, profile);
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  // Save the user's ID, email, or any identifier into the session
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  // Retrieve the user data from the session
  done(null, user);
});

export default passport;
