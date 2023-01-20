const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const Roledb = require('../models/Role');
const Userdb = require('../models/User');

const employeController = require('../controllers/EmployerController');
const reparationController = require('../controllers/reparationController');


exports.loginRoutes = (req, res) => {
    let response = {
        title: "login",
        error: req.query.error
    }
    res.render('login', response);
};

exports.redirectPageSPA = async(role_, res) => {
    empl = await employeController.findAll();
    res.render('index', { role: role_, moment: moment, employes: empl, title: 'Gestion Panel- Administrateur' });
};

exports.redirectPageClient = async(role_, res) => {
    res.render('client/list_voiture', { role: role_, moment: moment, title: 'Liste des voitures' });
};


exports.redirectPageRespAtelier = async(role_, res) => {
    const reparations_ = await reparationController.findAllReparationAttente();
   res.render('responsable/atelier/index', { role: role_, moment: moment,reparations:reparations_, title: 'Gestion Panel- reéception des voitures' });
};

exports.redirectPageRespFinancier = (role_, res) => {

};

exports.getData = (req, res) => {

    Userdb.findOne({ _id: req.user._id })
        .populate({ path: "role" })
        .exec((err, connected) => {
            if (!err) {
                if (connected.role.role == 'isSuperAdmin') { // SPA
                    this.redirectPageSPA(connected.role.role, res);
                }
                else if (connected.role.role == 'isAtelied') { // resp atelier
                    this.redirectPageRespAtelier(connected.role.role, res);
                }
                else if (connected.role.role == 'isFinancied') { //resp financier
                    this.redirectPageRespFinancier(connected.role.role, res);
                }
                else if(connected.role.role == 'isClient'){
                    this.redirectPageClient(connected.role.role,res);
                }
            }
        });
};


