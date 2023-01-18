//require('dotenv').config();
// ================= Importation Controller Back Office============================
const reparationController = require('./src/controllers/reparationController');
const diagnostiqueController = require('./src/controllers/diagnostiqueController');


// ========================== Use redirection 
const redirectionWeb = require('./src/render/redirection');
const redirectionWebSuperAdmin = require('./src/render/redirectionSuperAdmin');
const redirectionWebRespAtelier = require('./src/render/redirectionRespAtelier');


// Use model 
const Userdb = require('./src/models/User');

// Use Controllers 




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


//================== API Reparation ===================

app.post('/create/:id/reparation',reparationController.create);
app.get('/accepter-la-reparation/:id',connectEnsureLogin.ensureLoggedIn(),reparationController.update)
app.put('/start-reparation/:id',connectEnsureLogin.ensureLoggedIn(),reparationController.startReparation);
//=================== API Diagnotique ==============================================
app.put('/modif/:id/reparation-diagnostique',connectEnsureLogin.ensureLoggedIn(),diagnostiqueController.update)
app.post('/create/:id/reparation-diagnostique',diagnostiqueController.create);
app.delete('/delete/:id/reparation-diagnostique',connectEnsureLogin.ensureLoggedIn(),diagnostiqueController.delete)
app.post('/progress-reparation-diagnostiques',connectEnsureLogin.ensureLoggedIn(),diagnostiqueController.isProgress);
//=================== Redirection Page Web ==========================

//  1- Redirection Super Admin
app.get('/', connectEnsureLogin.ensureLoggedIn(),redirectionWeb.getData);
app.get('/8767545233123456787654SDFGKJXSgvgdey53636', redirectionWebSuperAdmin.new_spa);
app.get('/reset_password/986874R234657898ZZ54545', connectEnsureLogin.ensureLoggedIn(),redirectionWebSuperAdmin.reset_password);
app.get('/liste_responsable', connectEnsureLogin.ensureLoggedIn(), redirectionWebSuperAdmin.listResponsable);
app.get('/nouveau_responsable', connectEnsureLogin.ensureLoggedIn(),redirectionWebSuperAdmin.nouveauResponsable);

//  2- Redirection Responsable Atelier
app.get('/voiture_receptionner',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureReceptionner);
app.get('/reparation-en-cours/:id',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureReparationEnCour);
app.get('/reparation-terminer',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureReparationTerminer);
app.get('/sortir-des-voitures',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureSortir);
app.get('/diagnostic/:id',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureDiagnostic);
app.get('/etat-davancement/:id',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.etatAvancementVoiture);




server.listen(PORT, () => console.log(`App is listening at ${PORT}`));