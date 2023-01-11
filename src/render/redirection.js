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

/*
exports.listEnteprise = (role_, res) => {
    cEntreprise.findAll()
        .then((result) => {
            res.render('SA/config_entreprise', { role: role_, moment: moment, title: 'Entreprise', entreprise: result });
        });
};
*/