const moment = require('moment');
moment.suppressDeprecationWarnings = true;

exports.factureAttente = (req,res)=>{
    res.render('responsable/financier/index', {moment: moment, title: 'Gestion Panel-Facture-attente' });
};

exports.reparationFacturer = (req,res)=>{
    res.render('responsable/financier/list_reparation_terminer', {moment: moment, title: 'Gestion Panel- facture' });
};

exports.nouveauFacture = (req,res)=>{
    res.render('responsable/facture/nouveau_facture', {moment: moment, title: 'Gestion Panel- facture' });
};

exports.detailFacture = (req,res)=>{
    res.render('responsable/facture/detail_facture', {moment: moment, title: 'Gestion Panel- facture' });
};