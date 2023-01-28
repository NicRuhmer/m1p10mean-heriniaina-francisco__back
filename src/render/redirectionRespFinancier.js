const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const reparationController = require('../controllers/reparationController');
const diagnostiqueController = require('../controllers/diagnostiqueController');
const depenseController = require('../controllers/DepenseController');


exports.etatAvancementVoiture = async (req, res) => {
    const detail_ = await reparationController.findById(req.params.id);
    const tasks_ = await diagnostiqueController.findData(req.params.id, "isTask");
    const progress_ = await diagnostiqueController.findData(req.params.id, "isProgress");
    const finish_ = await diagnostiqueController.findData(req.params.id, "isFinish");

    res.render('responsable/financier/etat_avancement_reparation', {
        detail: detail_, tasks: tasks_.data, task_pourcentage: tasks_.pourcentage,
        progress: progress_.data, progress_pourcentage: progress_.pourcentage,
        finish: finish_.data, finish_pourcentage: finish_.pourcentage,
        role: req.user.role.role, moment: moment, title: "Gestion Panel- état d'avancement"
    });
};


exports.factureAttente = async (req, res) => {
    const liste_ = await reparationController.findAllReparationEnCourFinancier();
    res.render('responsable/financier/index', { role: req.user.role.role, moment: moment, listes: liste_, title: 'Gestion Panel-Facture-attente' });
};

exports.reparationFacturer = async (req, res) => {
    const liste_ = await reparationController.findAllReparationFacturer();
    res.render('responsable/financier/list_reparation_terminer', { role: req.user.role.role, moment: moment, listes: liste_, title: 'Gestion Panel- facture' });
};

exports.nouveauFacture = async (req, res) => {
    const detail_ = await reparationController.findById(req.params.id);
    const diagnostiques_ = await diagnostiqueController.findAll(req.params.id);
    res.render('responsable/facture/nouveau_facture', { role: req.user.role.role, moment: moment, detail: detail_, diagnostiques: diagnostiques_, title: 'Gestion Panel-nouveau-facture' });
};

exports.detailFacture = async (req, res) => {
    const detail_ = await reparationController.findFactureByReparation(req.params.id);
    const diagnostiques_ = await diagnostiqueController.findAll(req.params.id);
    const montant_ = await diagnostiqueController.totaleMontant(req.params.id);
    res.render('responsable/facture/detail_facture', { role: req.user.role.role, moment: moment, detail: detail_, diagnostiques: diagnostiques_, montant: montant_, title: 'Gestion Panel- facture' });
};

exports.listOtherDepense = async (req, res) => {
    const depenses_ = await depenseController.findAllDepense();
    depenseController.findAllOtherDepense().then((list_depenses_) => {
        res.render('responsable/financier/depense/depense', { role: req.user.role.role, moment: moment, depenses: depenses_, list_depenses: list_depenses_, title: 'Gestion Panel- depense' });
    }).catch((err) => {
        res.send({ status: 200, message: err.message });
    });
};

exports.nouveauTypeDepense = async (req, res) => {
    const depenses_ = await depenseController.findAllDepense();
    res.render('responsable/financier/depense/ajout_depense', { role: req.user.role.role, moment: moment, depenses: depenses_, title: 'Gestion Panel- ajout-depense' });
};

exports.filterListDepense=async (req,res)=>{
    const depenses_ = await depenseController.findAllDepense();
    depenseController.listOtherDepenseFilter(req.body.date,req.body.categorie).then((list_depenses_) => {
        res.render('responsable/financier/depense/depense', { role: req.user.role.role, moment: moment, depenses: depenses_, list_depenses: list_depenses_, title: 'Gestion Panel- depense' });
    }).catch((err) => {
        res.send({ status: 200, message: err.message });
    });
}