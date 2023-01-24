const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const reparationController = require('../controllers/reparationController');
const diagnostiqueController = require('../controllers/diagnostiqueController');


exports.voitureReceptionner = async(req, res) => {
    const repararation_ = await reparationController.findAllReparationReceptionner(req.user._id);
    res.render('responsable/atelier/liste_voiture_receptionner', { role: req.user.role.role, moment: moment,receptionners:repararation_, title: 'Gestion Panel- voitures-réceptionnners' });
};
exports.voitureReparationTerminer = async(req, res) => {
      const reparations_ = await reparationController.findAllReparationEnCour(req.user._id);
    res.render('responsable/atelier/liste_reparation_terminer', { reparations:reparations_,role: req.user.role.role, moment: moment, title: 'Gestion Panel- réparation-terminer' });
};

exports.voitureDiagnostic = async(req,res)=>{
    const detail_ = await reparationController.findById(req.params.id);
    const diagnostiques_ = await diagnostiqueController.findAll(req.params.id);
    
    res.render('responsable/atelier/diagnostic', { detail:detail_,diagnostiques:diagnostiques_,role: req.user.role.role, moment: moment, title: 'Gestion Panel- diagnostic' });
};
exports.etatAvancementVoiture = async(req,res)=>{
   
     const detail_ = await reparationController.findById(req.params.id);
     const tasks_ = await diagnostiqueController.findData(req.params.id,"isTask");
     const progress_ = await diagnostiqueController.findData(req.params.id,"isProgress");
     const finish_ = await diagnostiqueController.findData(req.params.id,"isFinish");

   res.render('responsable/atelier/etat_avancement', { 
    detail:detail_,tasks:tasks_.data, task_pourcentage:tasks_.pourcentage,
    progress:progress_.data,progress_pourcentage:progress_.pourcentage,
    finish:finish_.data, finish_pourcentage:finish_.pourcentage,
    role: req.user.role.role, moment: moment, title: "Gestion Panel- état d'avancement" });
};