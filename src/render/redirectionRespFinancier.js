const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const reparationController = require('../controllers/reparationController');
const diagnostiqueController = require('../controllers/diagnostiqueController');


exports.etatAvancementVoiture = async(req,res)=>{
     const detail_ = await reparationController.findById(req.params.id);
     const tasks_ = await diagnostiqueController.findData(req.params.id,"isTask");
     const progress_ = await diagnostiqueController.findData(req.params.id,"isProgress");
     const finish_ = await diagnostiqueController.findData(req.params.id,"isFinish");

   res.render('responsable/financier/etat_avancement_reparation', { 
    detail:detail_,tasks:tasks_.data, task_pourcentage:tasks_.pourcentage,
    progress:progress_.data,progress_pourcentage:progress_.pourcentage,
    finish:finish_.data, finish_pourcentage:finish_.pourcentage,
    role: req.user.role.role, moment: moment, title: "Gestion Panel- état d'avancement" });
};


exports.factureAttente = async(req,res)=>{
    const liste_ = await reparationController.findAllReparationEnCourFinancier();
    res.render('responsable/financier/index', {moment: moment,listes:liste_, title: 'Gestion Panel-Facture-attente' });
};

exports.reparationFacturer = (req,res)=>{
    res.render('responsable/financier/list_reparation_terminer', {moment: moment, title: 'Gestion Panel- facture' });
};

exports.nouveauFacture = async (req,res)=>{
     const detail_ = await reparationController.findById(req.params.id);
    const diagnostiques_ = await diagnostiqueController.findAll(req.params.id);
    res.render('responsable/facture/nouveau_facture', {moment: moment,detail:detail_,diagnostiques:diagnostiques_, title: 'Gestion Panel-nouveau-facture' });
};

exports.detailFacture = async(req,res)=>{
    const detail_ = await reparationController.findFactureByReparation(req.params.id);
    const diagnostiques_ = await diagnostiqueController.findAll(req.params.id);
 
    res.render('responsable/facture/detail_facture', {moment: moment,detail:detail_,diagnostiques:diagnostiques_, title: 'Gestion Panel- facture' });
};