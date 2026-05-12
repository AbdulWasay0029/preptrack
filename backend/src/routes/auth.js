const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Successful authentication, issue JWT
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Long lived token or as per preference
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.WEB_URL}/login?token=${token}`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
