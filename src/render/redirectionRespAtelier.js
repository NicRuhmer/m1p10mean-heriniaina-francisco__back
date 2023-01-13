const moment = require('moment');
moment.suppressDeprecationWarnings = true;

exports.voitureReceptionner = (req, res) => {
    res.render('responsable/atelier/liste_voiture_receptionner', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- voitures réceptionnners' });
};
exports.voitureReparationEnCour = (req, res) => {
    res.render('responsable/atelier/liste_reparation_en_cours', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- réparation en cours' });
};
exports.voitureReparationTerminer = (req, res) => {
    res.render('responsable/atelier/liste_reparation_terminer', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- réparation terminer' });
};
exports.voitureSortir = (req, res) => {
    res.render('responsable/atelier/liste_sortir_voiture', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- sortir des voitures' });
};
exports.voitureDiagnostic = (req,res)=>{
    res.render('responsable/atelier/diagnostic', { role: req.user.role.role, moment: moment, title: 'Gestion Panel- diagnostic' });
};
exports.etatAvancementVoiture = (req,res)=>{
    res.render('responsable/atelier/etat_avancement', { role: req.user.role.role, moment: moment, title: "Gestion Panel- état d'avancement" });
};