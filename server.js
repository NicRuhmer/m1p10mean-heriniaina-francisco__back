//require('dotenv').config();
// ================= Importation Controller Back Office============================
const reparationController = require('./src/controllers/reparationController');
const diagnostiqueController = require('./src/controllers/diagnostiqueController');
const userController = require('./src/controllers/userController');
const factureController = require('./src/controllers/factureController');

// ========================== Use redirection 
const redirectionWeb = require('./src/render/redirection');
const redirectionWebSuperAdmin = require('./src/render/redirectionSuperAdmin');
const redirectionWebRespAtelier = require('./src/render/redirectionRespAtelier');
const redirectionRespFinancier = require('./src/render/redirectionRespFinancier');

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
app.use('/fonts', express.static("public/fonts"));
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
   Userdb.findOne({ username: email,status:true })
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

//================== API Reset Password ===============

app.put('/reset_password/:id/user',async(req,res)=>{

    if(req.body.new_password == req.body.confirm_password){
        const user = await Userdb.findById(req.params.id);
        bcrypt.compare(req.body.last_password, user.password, function (err2, res2) {
          if (err2) {
              res.send({status:400,message:"Votre mot de passe précedent est incorrect"});
          }
          else if (res2 === false) {
            res.send({ status:400,message: "Mot de passe incorrecte" });
          }
          else {
            userController.reset_password(req.params.id,req.body.confirm_password).then((result)=>{
                res.send(result);
            }).catch((err)=>{
                res.send(err);
            });
          }
        });
    
    } else {
      res.send({status:400,message:' Votre nouveau mot de passe est incorrect'});
    }
    
});

//================== API User Connected =====================
app.get('/user-connected', connectEnsureLogin.ensureLoggedIn(), userController.findUserConnected);


//================== API Reparation atelier ===================

app.post('/create/:id/reparation',reparationController.create);
app.put('/accepter-la-reparation/:id',connectEnsureLogin.ensureLoggedIn(),reparationController.update)
app.put('/start-reparation/:id',connectEnsureLogin.ensureLoggedIn(),reparationController.startReparation);
app.get('/list-reparation',(req,res)=>{
      reparationController.findAllReparationEnCour("63ca97231a809713932b5ff0").then((tmp)=>{
      res.send(tmp);  
      });
      
});


//================== API Reparation financier ===================

app.post('/valide/:id/sortit-vehicule',reparationController.valider_sortir);
app.post('/valide/:id/facture',connectEnsureLogin.ensureLoggedIn(),reparationController.valider_facture);

//=================== API Diagnotique ==============================================
app.put('/modif/:id/reparation-diagnostique',connectEnsureLogin.ensureLoggedIn(),diagnostiqueController.update)
app.post('/create/:id/reparation-diagnostique',diagnostiqueController.create);
app.delete('/delete/:id/reparation-diagnostique',connectEnsureLogin.ensureLoggedIn(),diagnostiqueController.delete)
app.post('/progress-reparation-diagnostiques',connectEnsureLogin.ensureLoggedIn(),diagnostiqueController.isProgress);

//=================== API Facture =================================================
app.put('/edit/:id/diagnostique',connectEnsureLogin.ensureLoggedIn(),diagnostiqueController.updateFacture);
app.post('/verify-facture',connectEnsureLogin.ensureLoggedIn(),factureController.verifyNumFacture);
app.post('/save/:id/new-facture',connectEnsureLogin.ensureLoggedIn(),factureController.saveFacture);
app.get('/detail/:id/teste',(req,res)=>{
  diagnostiqueController.totaleMontant(req.params.id).then((v)=>{
    res.send(v);
  }).catch((err)=>{
    res.send(err.message);
  })
});





//=================== Redirection Page Web ==========================

//  1- Redirection Super Admin
app.get('/', connectEnsureLogin.ensureLoggedIn(),redirectionWeb.getData);
app.get('/8767545233123456787654SDFGKJXSgvgdey53636', redirectionWebSuperAdmin.new_spa);
app.get('/reset_password/986874R234657898ZZ54545', connectEnsureLogin.ensureLoggedIn(),redirectionWebSuperAdmin.reset_password);
app.get('/liste_responsable', connectEnsureLogin.ensureLoggedIn(), redirectionWebSuperAdmin.listResponsable);
app.get('/nouveau_responsable', connectEnsureLogin.ensureLoggedIn(),redirectionWebSuperAdmin.nouveauResponsable);
app.get('/modification/equipe/:id', connectEnsureLogin.ensureLoggedIn(),redirectionWebSuperAdmin.modificationResponsable);

//  2- Redirection Responsable Atelier
app.get('/voiture_receptionner',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureReceptionner);
app.get('/reparation-terminer',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureReparationTerminer);
app.get('/diagnostic/:id',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.voitureDiagnostic);
app.get('/etat-davancement/:id',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.etatAvancementVoiture);
app.get('/detail/:id/facture-client',connectEnsureLogin.ensureLoggedIn(),redirectionWebRespAtelier.detailFacture);

// 3- Redirection Responsable Financier
app.get('/nouveau/:id/facture',connectEnsureLogin.ensureLoggedIn(), redirectionRespFinancier.nouveauFacture);
app.get('/detail/:id/facture',connectEnsureLogin.ensureLoggedIn(), redirectionRespFinancier.detailFacture);
app.get('/reparation-payer',connectEnsureLogin.ensureLoggedIn(),redirectionRespFinancier.reparationFacturer);
app.get('/facture-attente',connectEnsureLogin.ensureLoggedIn(),redirectionRespFinancier.factureAttente);
app.get('/etat-davancement/:id/reparation',connectEnsureLogin.ensureLoggedIn(),redirectionRespFinancier.etatAvancementVoiture);
app.get('/depense',connectEnsureLogin.ensureLoggedIn(),redirectionRespFinancier.listOtherDepense);
app.get('/ajout-depense',connectEnsureLogin.ensureLoggedIn(),redirectionRespFinancier.nouveauTypeDepense);
// app.post('/depense',redirectionRespFinancier.filterListDepense);



server.listen(PORT, () => console.log(`App is listening at ${PORT}`));