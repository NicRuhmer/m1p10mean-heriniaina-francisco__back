const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const Roledb = require('../models/Role');
const Userdb = require('../models/User');


exports.loginRoutes = (req, res) => {
    let response = {
        title: "login",
        error: req.query.error
    }
    res.render('login', response);
};

exports.redirectPageSPA = (role_, res) => {
    res.render('index', { role: role_, moment: moment, title: 'Gestion Panel- Administrateur' });
};

exports.redirectPageRespAtelier = (role_, res) => {

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
            }
        });
};


exports.listResponsable = (req, res) => {
    res.render('spa/liste_responsable', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- liste responsable' });
};

exports.nouveauResponsable = (req, res) => {
    res.render('spa/nouveau_responsable', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- nouveau responsable' });
};
