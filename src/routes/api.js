const express = require('express');
const route = express.Router();

const nodemailer = require('nodemailer');


const userController = require('../controllers/userController');
const employeController = require('../controllers/employerController');
const defaultDataController = require('../controllers/DefaultDataController');
const clientController = require('../controllers/ClientController');
const voitureController = require('../controllers/VoitureController');
const depenseController = require('../controllers/DepenseController');
const reparationController = require('../controllers/reparationController');

const diagnostiqueController = require('../controllers/diagnostiqueController');

const statistiqueController = require('../controllers/StatistiqueController');
//=================== Route Super Admin ==================
route.get('/initialisation-role-status', defaultDataController.insertDefaultData);

route.post('/verify-mail-user', userController.verifyEmail);
route.get('/list', (req, res) => {
    userController.teste().then((data) => {
        res.send(data)
    })
});
route.post('/new-first-spa', (req, res) => {
    userController.saveNewSAP(req.body.nicname, req.body.username, req.body.new_password, req.body.confirm_password).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    })
});

//============= Api Employer ===========================
route.post('/resp.create', employeController.new_resp);
route.put('/resp.update/:id', employeController.update);
route.delete('/resp.delete', employeController.delete);







//=========== API voiture =============================
//  id client
route.get('/list/:id/voiture', voitureController.findAll);
route.get('/detail/:id/voiture', voitureController.findById);
//  id client
route.post('/create/:id/voiture', voitureController.create);
route.put('/update/:id/voiture', voitureController.update);

//=========== API Reparation voiture Client ====================
//  id client
route.post('/create/:id/reparation',reparationController.create);
route.put('/update/:id/reparation',reparationController.updateReparation);
route.delete('/delete/:id/reparation',reparationController.deleteReparation);
//  id client
route.get('/list/:id/reparation-client-accepter',reparationController.findAllReparationAccepter);
//  id client
route.get('/list/:id/reparation-client-attente',reparationController.findAllReparationAttente);

// id reparation
route.get('/etat-avancement/:id/reparation-client',async (req,res)=>{

    const detail_ = await reparationController.findById(req.params.id);
    const tasks_ = await diagnostiqueController.findData(req.params.id, "isTask");
    const progress_ = await diagnostiqueController.findData(req.params.id, "isProgress");
    const finish_ = await diagnostiqueController.findData(req.params.id, "isFinish");
    res.send({
        detail: detail_, tasks: tasks_.data, task_pourcentage: tasks_.pourcentage,
        progress: progress_.data, progress_pourcentage: progress_.pourcentage,
        finish: finish_.data, finish_pourcentage: finish_.pourcentage
    });
    
});

// id voiture
route.get('/historique/:id/reparation-client',reparationController.findAllHistoriqueReparation);

//=========== API Client ==============================
route.post('/client.create', clientController.new_client);
route.post('/login.user',clientController.login_client);












//======================= API Depense ===================
route.post('/depenses',async(req,res)=>{
    const depenses_ = await depenseController.findAllDepense();
    depenseController.listOtherDepenseFilter(req.body.date,req.body.categorie).then((list_depenses_) => {
        res.send({  depenses: depenses_, list_depenses: list_depenses_});
    }).catch((err) => {
        res.send({ status: 400, message: err.message });
    });
});

route.get('/depense.get/:id', depenseController.findAllDepenseById);
route.post('/depense.create', depenseController.saveDepense);
route.put('/depense.update/:id', depenseController.updateDepense);
route.delete('/depense.delete/:id', depenseController.deleteDepense);
route.get('/other-depense.get/:id', depenseController.findAllOtherDepenseById);
route.post('/other-depense.create', depenseController.saveOtherDepense);
route.put('/other-depense.update/:id', depenseController.updateOtherDepense);
route.delete('/other-depense.delete/:id', depenseController.deleteOtherDepense);

route.post('/statistiqueFilter',statistiqueController.statistiqueFilter);

/*
route.post('/statistiqueFilter',depenseController.statistiqueFilter);
route.post('/chiffre-affaire-filter',reparationController.totaleChiffreAffaireFilter);
*/
route.get('/test-statistiques',(req,res)=>{
    depenseController.statistiques().then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send({status:400,message:err.mesage});
    })
});
route.get('/test-statistique-chiffre-affaire',(req,res)=>{
    reparationController.totaleChiffreAffaire().then((result)=>{
            res.send(result)
    }).catch((err)=>{
        res.send(err);
    });
});

route.get('/test-montant-diagnostique/:id',(req,res)=>{
    diagnostiqueController.totaleMontant(req.params.id).then((result)=>{
            res.send(result)
    }).catch((err)=>{
        res.send(err);
    });
});

// ====================== API User ==========================

route.put('/desactived/:id/teams', (req, res) => {
    userController.desactived(req.params.id).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send({ status: 400, message: err.mesage })
    });
});

route.put('/actived/:id/teams', (req, res) => {
    userController.actived(req.params.id).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send({ status: 400, message: err.mesage })
    });
});



/*===================== APIT TESTE ===================*/

route.post('/send-mail-teste', (req, res) => {
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'antoenjara1998@gmail.com',
            pass: 'yzcufbqfsttpwblh'
        }
    });
    var mailOption = {
        from: 'Projet-Meam-M1<antoenjara1998@gmail.com>',
        to: 'francisco@constellation-group.co',
        replyTo: 'francisco@constellation-group.co',
        subject: 'Teste envoie email',
        text: 'Bonjour,'
    };

    /*     html:listing.contenu,
        attachments: [
            {
                filename: entries.cv_.name,
                path: process.env.URL_HOST + entries.cv_.url,
                cid: entries.cv_.hash
            },
            {
                filename: entries.lm_.name,
                path: process.env.URL_HOST + entries.lm_.url,
                cid: entries.lm_.hash
            }
        ]*/

    transport.sendMail(mailOption, (err, info) => {
        if (err) {
            console.log(err.message);
            res.send({ status: 400, message: err.message });
        } else {
            console.log(info.response);
            res.send({ status: 200, message: 'email envoyer', data: info.response });
        }
    });
});








module.exports = route;