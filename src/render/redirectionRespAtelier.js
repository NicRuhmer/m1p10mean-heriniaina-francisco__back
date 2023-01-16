const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const reparationController = require('../controllers/reparationController');
const diagnostiqueController = require('../controllers/diagnostiqueController');


exports.voitureReceptionner = async(req, res) => {
    const repararation_ = await reparationController.findAllReparationReceptionner(req.user._id);
    res.render('responsable/atelier/liste_voiture_receptionner', { role: req.user.role.role, moment: moment,receptionners:repararation_, title: 'Gestion Panel- voitures réceptionnners' });
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
exports.voitureDiagnostic = async(req,res)=>{
    const detail_ = await reparationController.findById(req.params.id);
    const diagnostiques_ = await diagnostiqueController.findAll(req.params.id);
    res.render('responsable/atelier/diagnostic', { detail:detail_,diagnostiques:diagnostiques_,role: req.user.role.role, moment: moment, title: 'Gestion Panel- diagnostic' });
};
exports.etatAvancementVoiture = async(req,res)=>{
     const detail_ = await reparationController.findById(req.params.id);
    const diagnostiques_ = await diagnostiqueController.findAll(req.params.id);

    res.render('responsable/atelier/etat_avancement', {  detail:detail_,diagnostiques:diagnostiques_,role: req.user.role.role, moment: moment, title: "Gestion Panel- état d'avancement" });
};