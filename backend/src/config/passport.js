const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/google/callback` : "http://localhost:3001/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const google_id = profile.id;
    const name = profile.displayName;

    try {
      // Find or create user
      const { rows } = await db.query(
        `INSERT INTO users (email, google_id, name)
         VALUES ($1, $2, $3)
         ON CONFLICT (email)
         DO UPDATE SET google_id = COALESCE(users.google_id, EXCLUDED.google_id), name = COALESCE(users.name, EXCLUDED.name)
         RETURNING *`,
        [email, google_id, name]
      );
      
      return done(null, rows[0]);
    } catch (err) {
      console.error('Passport Google Strategy error:', err);
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
