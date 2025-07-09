require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// user serialization
passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser((email, done) => {
  done(null, { email });
});

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails && profile.emails[0] && profile.emails[0].value;
  if (!email) return done(new Error('No email found'));
  return done(null, { email });
}));

// route to start OAuth login
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// OAuth callback
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  res.redirect('/profile');
});

app.get('/logout', (req, res) => {
  req.logout(err => { if (err) console.error(err); });
  res.redirect('/');
});

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// storage for uploaded files per user
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = path.join(__dirname, 'uploads', req.user.email);
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// upload endpoint
app.post('/upload', ensureAuth, upload.single('card'), (req, res) => {
  res.json({ file: req.file.filename });
});

// list user cards
app.get('/cards', ensureAuth, (req, res) => {
  const userDir = path.join(__dirname, 'uploads', req.user.email);
  let files = [];
  try {
    files = fs.readdirSync(userDir);
  } catch (e) {}
  res.json({ cards: files });
});

// simple home/login pages
app.get('/', (req, res) => res.send('Home - <a href="/auth/google">Login with Google</a>'));
app.get('/login', (req, res) => res.send('<a href="/auth/google">Login with Google</a>'));
app.get('/profile', ensureAuth, (req, res) => res.send(`Hello ${req.user.email}! <form method="post" enctype="multipart/form-data" action="/upload"><input type="file" name="card"/><button>Upload</button></form><a href="/cards">My Cards</a>`));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
