//require('dotenv').config();


// Use redirection 
const redirectionWeb = require('./src/render/redirection');

// Use model 
const Userdb = require('./src/models/User');





const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require("cors");
const moment = require('moment');

const server = require('http').createServer(app);
//const PORT = process.env.PORT || 3000;
const PORT = 3000;
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

moment.suppressDeprecationWarnings = true;
app.use(bodyParser.urlencoded({ extended: false }));
/*

app.use(bodyParser.json());
app.use(cors(corsOptions));*/


// ================================== AUTHENTIFICATION =====================================

app.use(require("express-session")({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true
}));

const bcrypt = require('bcrypt');
const passport = require("passport");
const localStrategy = require("passport-local");
const connectEnsureLogin = require('connect-ensure-login');// authorization

app.use(passport.initialize());
app.use(passport.session());
passport.use(Userdb.createStrategy());
passport.serializeUser(Userdb.serializeUser());
passport.deserializeUser(Userdb.deserializeUser());



app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static("views"));

app.use('/logo', express.static("public/logo"));
app.use('/js', express.static("public/js"));
app.use('/css', express.static("public/css"));
app.use('/scss', express.static("public/scss"));

// ================================ IMPORTATION =========================
// Use connection Database
const connectDB = require('./src/database/connection');
connectDB();

// Use router
app.use('/', require('./src/routes/api'));


// ================================ AUTHENTIFICATION D'UTILISATEUR =========================

passport.serializeUser(function (user, done) {
  done(null, user.id)
});

passport.deserializeUser(function (id, done) {
  //setup user model
  Userdb.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function (email, password, done) {
  Userdb.findOne({ username: email })
    .populate({
      path: 'role'
    }).exec((err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Identification incorrecte" });
      }
      bcrypt.compare(password, user.password, function (err2, res2) {
        if (err2) {
          return done(err2);
        }
        else if (res2 === false) {
          return done(null, false, { message: "Mot de passe incorrecte" });
        }
        else {
          return done(null, user);
        }
      });
    });
}));

function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    console.log('session dead');
    return next();
  }
  res.redirect('/');
}


app.get('/login', isLoggedOut, redirectionWeb.loginRoutes);

app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

app.get("/login-stoped", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    res.redirect("/login?error=true");
  });
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login?error=true'"
}), function (req, res) {
});


app.get('/connection/:username/:password', (req, res) => {
  Userdb.findOne({ username: req.params.username })
    .populate({
      path: 'role'
    }).exec((err, user) => {
      console.log(user)
      if (err) {
        res.send(err);
      }
      if (!user) {
        res.send({ message: "Identification incorrecte" });
      }
      bcrypt.compare(req.params.password, user.password, function (err, res1) {
        if (err) {
          res.send(err);
        }
        else if (res1 === false) {
          res.send({ message: "Mot de passe incorrecte" });
        }
        else {
          res.send(user);
        }
      });
    });
});




//=================== Redirection Page Web ==========================
app.get('/8767545233123456787654SDFGKJXSgvgdey53636', (req, res) => {
  res.render('spa/new_sap');
});

app.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  redirectionWeb.getData(req, res);
 
});

app.get('/liste_responsable', connectEnsureLogin.ensureLoggedIn(), redirectionWeb.listResponsable);

app.get('/nouveau_responsable', connectEnsureLogin.ensureLoggedIn(),redirectionWeb.nouveauResponsable);


server.listen(PORT, () => console.log(`App is listening at ${PORT}`));