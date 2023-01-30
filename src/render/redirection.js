const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const Userdb = require('../models/User');

const employeController = require('../controllers/EmployerController');
const reparationController = require('../controllers/reparationController');
const depenseController = require('../controllers/DepenseController');
const diagnostiqueController = require('../controllers/diagnostiqueController');


exports.loginRoutes = (req, res) => {
    let response = {
        title: "login",
        error: req.query.error
    }
    res.render('login', response);
};

exports.redirectPageSPA = async (role_, res) => {
    employeController.findAll().then((empl) => {
        res.render('index', { role: role_, moment: moment, employes: empl, title: 'Gestion Panel-Responsable' });
    });

};

exports.redirectPageClient = async (role_, res) => {
    res.render('client/list_voiture', { role: role_, moment: moment, title: 'Liste des voitures' });
};


exports.redirectPageRespAtelier = async (role_, res) => {
    const reparations_ = await reparationController.findAllReparationAttente();
    res.render('responsable/atelier/index', { role: role_, moment: moment, reparations: reparations_, title: 'Gestion Panel-réception-des-voitures' });
};

exports.redirectPageRespFinancier = async (role_, res) => {
    const stat_ = await depenseController.statistiques();
    const chiff_affaire_ = await reparationController.totaleChiffreAffaire();
    var benefice_ = 0;
    var totaleDepense_ = 0;
    for (let index = 0; index < stat_.length; index++) {
        totaleDepense_ += stat_[index].totale;
    }
    benefice_ = (chiff_affaire_.chiffre_daffaire - totaleDepense_);
    res.render('responsable/financier/tableau_bord', { role: role_, moment: moment, benefice: benefice_, moyen_temps_reparation: chiff_affaire_.moyen_temps_reparation, chiffre_affaire: chiff_affaire_.chiffre_daffaire, statistiques: stat_, title: 'Gestion Panel- dashbord' });
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
                else  {
                    res.render('/login');
                }
            }
        });
};


