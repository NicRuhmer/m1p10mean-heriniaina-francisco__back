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

/*
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use('/js',express.static("public/js"));
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
      console.log(user);
      bcrypt.compare(password, user.password, function (err, res) {
        if (err) {
          return done(err);
        }
        else if (res === false) {
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









app.get('/8767545233123456787654SDFGKJXSgvgdey53636',(req,res)=>{
  res.render('spa/new_sap');
});


app.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // services.getData(req, res);
  res.render('index',{title:'home',role:'aaa'})
});
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



app.post('/reset_password', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  bcrypt.compare(req.body.lastpassword, req.user.password, function (err, result) {
    if (err) {
      res.send({ status: 404, message: err.message });
    }
    else if (result === false) {
      res.send({ status: 404, message: "Information incorrecte" });
    }
    else {
      cUser.reset_password(req.user._id, req.body.lastpassword, req.body.confirmpassword).then((result) => {
        res.send(result);
      }).catch((err) => {
        res.send({ status: 404, message: err.message });
      });
    }
  });
});


server.listen(PORT, () => console.log(`App is listening at ${PORT}`));