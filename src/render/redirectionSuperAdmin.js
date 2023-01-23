const bcrypt = require('bcrypt');

const moment = require('moment');
moment.suppressDeprecationWarnings = true;

var Roledb = require('../models/Role');
var Userdb = require('../models/User');
var cRole = require('../controllers/roleController');
var cEmployer = require('../controllers/EmployerController');
exports.new_spa = (req, res) => {
    res.render('spa/new_sap');
};
exports.reset_password = (req, res) => {
    res.render('spa/reset_password_spa', { moment: moment,user_id:req.user._id, role: req.user.role.role, title: 'Changer le mot de passe', email: req.user.username });
}
exports.listResponsable = (req, res) => {
    res.render('spa/liste_responsable', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- liste responsable' });
};
exports.nouveauResponsable = (req, res) => {
    cRole.listRoleResponsable().then((data)=>{
        res.render('spa/nouveau_responsable', { role: req.user.role.role, moment: moment, title: 'Gestion Panel-Nouveau', roles:data });
    })
 };

 exports.modificationResponsable = (req, res) => {
    cEmployer.findById(req.params.id).then((data)=>{
        res.render('spa/modification_responsable', { detail:data,role: req.user.role.role, moment: moment, title: 'Gestion Panel-Modification' });
    })
 };