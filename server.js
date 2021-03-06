const express = require('express');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const db = require('./db');

/**
 * Configure the local strategy for use by Passport.
 *
 * the local strategy require a `verify` function which receives the credentials
 * (`username` and `password`) submitted by the user. The function must verify
 * that the password is correct and then invoke `cb` with a user object, which
 * will be set at `req.user` in route handlers after authentication.
 */
passport.use(
  new Strategy((username, password, cb) => {
    db.users.findByUsername(username, (err, user) => {
      if (err) return cb(err);
      if (!user) return cb(null, false);
      if (user.password != password) return cb(null, false);

      return cb(null, user);
    });
  })
);

/**
 * Configure Passport authenticated session persistence.
 *
 * Inorder to restore authentication state across HTTP requests, Passport needs
 * to serialize users into and deserialize users out of the session. The
 * typical implementation of this is as simple as supplying the user ID when
 * serializing, and querying the user record by ID from the database when
 * deserializing.
 */
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.users.findById(id, (err, user) => {
    if (err) return cb(err);

    cb(null, user);
  });
});

// new express App
const app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// express middleware
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get(
  '/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.render('profile', { user: req.user });
  }
);

app.listen(3000, () => {
  console.log('app listening at http://localhost:3000');
});
