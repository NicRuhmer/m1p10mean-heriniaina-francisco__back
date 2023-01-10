const axios = require('axios');
require('dotenv').config();

const moment = require('moment');
moment.suppressDeprecationWarnings = true;


const Userdb = require('../../model/call/utilisateur');


exports.loginRoutes = (req, res) => {
    let response = {
        title: "login",
        error: req.query.error
    }
    res.render('login', response);
};


exports.listEnteprise = (role_, res) => {
    cEntreprise.findAll()
        .then((result) => {
            res.render('SA/config_entreprise', { role: role_, moment: moment, title: 'Entreprise', entreprise: result });
        });
};
