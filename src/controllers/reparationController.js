const moment = require('moment');
moment.suppressDeprecationWarnings = true;

var Reparationdb = require('../models/Reparation');
var Employedb = require('../models/Employer');
var Clientdb = require('../models/Client');
var Voituredb = require('../models/Voiture');

var diagnostiqueController = require('./diagnostiqueController');
var authentificationMail = require('./AuthentificationMail');

function round(num, decimalPlaces = 0) {
    num = Math.round(num + "e" + decimalPlaces);
    return Number(num + "e" + -decimalPlaces);
}

exports.create = (req, res) => {
    const new_ = {
        voiture: req.body.voiture,
        client: req.params.id,
        description: req.body.description,
        employe: null,
        facture: null,
        release_date: null,
        status: false,
        start: false
    };

    if (new_.voiture != null && new_.client != null && new_.status != null) {
        const new__ = new Reparationdb(new_);
        new__.save((err, docs) => {
            if (err) {
                console.log(err.message);
                res.send({ status: 400, message: err.message });
            } else {
                console.log('Success !');
                res.send({ status: 200, data: docs, message: "Success !" });
            }
        });
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};

exports.updateReparation = (req, res) => {
    const dataUpdated = {
        voiture: req.body.voiture,
        description: req.body.description
    };

    if (dataUpdated.voiture != null) {
        Reparationdb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                res.send({ status: 404, message: "La modification a échoué!" });
            } else { 
                res.send({status:200,message:"Réparation modifié avec success !"});
            }
        });
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};

exports.deleteReparation = (req, res) => {
    if (req.params.id != null) {
        Reparationdb.findByIdAndDelete(req.params.id).then((result) => {
            res.send({ status: 200, message: 'Suppression terminé !' })
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
    } else {
        res.send({ status: 400, message: " Champs invalide !" });
    }
};

exports.findAllReparationAccepter = (req,res) => {
   
        Reparationdb.find({ client:req.params.id,employe: { $ne: null }, start: true })
            .populate({
                path: 'voiture',
            })
            .populate({
                path: 'employe'
            })
            .exec(async (err, result) => {
                if (err) {
                    console.log(err.message)
                    res.send({ status: 400, message: err.message });
                } else {

                    var tab = [];
                    for (var i = 0; i < result.length; i++) {
                        const tmp = await diagnostiqueController.estimationReparation(result[i]._id);
                        const tmp2 = await diagnostiqueController.totaleMontant(result[i]._id);
                        tab.push({ data: result[i], pourcentage: tmp.pourcentage, montant: tmp2.totaleTTC });
                
                    }
                    res.send(tab);
                }
            });
  
};

exports.findAllReparationAttente = (req,res) => {
   
    Reparationdb.find({ client:req.params.id,employe: null, start: false, facture: null })
        .populate({
            path: 'voiture',
        })
        .populate({
            path: 'employe'
        })
        .exec(async (err, result) => {
            if (err) {
                console.log(err.message)
                res.send({ status: 400, message: err.message });
            } else {

                var tab = [];
                for (var i = 0; i < result.length; i++) {
                    const tmp = await diagnostiqueController.estimationReparation(result[i]._id);
                    tab.push({ data: result[i], pourcentage: tmp.pourcentage });
                }
                res.send(tab);
            }
        });

};

exports.findAllHistoriqueReparation = (req,res) => {
   
    Reparationdb.find({ voiture:req.params.id })
        .populate({
            path: 'voiture',
        })
        .populate({
            path: 'employe'
        })
        .exec(async (err, result) => {
            if (err) {
                console.log(err.message)
                res.send({ status: 400, message: err.message });
            } else {

                var tab = [];
                for (var i = 0; i < result.length; i++) {
                    const tmp = await diagnostiqueController.estimationReparation(result[i]._id);
                    const tmp2 = await diagnostiqueController.totaleMontant(result[i]._id);
                    tab.push({ data: result[i], pourcentage: tmp.pourcentage, montant: tmp2.totaleTTC });
                }
                res.send(tab);
            }
        });

};


//====================================================================================
exports.findAllReparationEnCourFinancier = () => {
    return new Promise((resolve, reject) => {

        Reparationdb.find({ employe: { $ne: null }, start: true, facture: null })
            .populate({
                path: 'voiture',
                populate: {
                    path: 'client'
                }
            })
            .populate({
                path: 'employe'
            })
            .exec(async (err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {

                    var tab = [];
                    for (var i = 0; i < result.length; i++) {
                        const tmp = await diagnostiqueController.estimationReparation(result[i]._id);
                        tab.push({ data: result[i], pourcentage: tmp.pourcentage });
                    }
                    resolve(tab);
                }
            });
    });
};

exports.findAllReparationEnCour = (user_id) => {
    return new Promise(async (resolve, reject) => {
        const emp = await Employedb.findOne({ user: user_id });

        Reparationdb.find({ employe: emp._id, start: true })
            .populate({
                path: 'voiture',
                populate: {
                    path: 'client'
                }
            })
            .populate({
                path: 'employe'
            })
            .exec(async (err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {
                    var tab = [];
                    for (var i = 0; i < result.length; i++) {
                        const tmp = await diagnostiqueController.estimationReparation(result[i]._id);
                        const tmp2 = await diagnostiqueController.totaleMontant(result[i]._id);
                        tab.push({ data: result[i], pourcentage: tmp.pourcentage, montant: tmp2.totaleTTC });
                    }
                    resolve(tab);
                }
            });
    });
};


exports.totaleChiffreAffaire = () => {
    return new Promise((resolve, reject) => {
        var totale_chiffre_daffaire = 0;
        var moyen_heure_reparation = 0;
        var totale_heure_reparation = 0;
        var totale_nb_reparation = 0;
        Reparationdb.find({ employe: { $ne: null }, facture: { $ne: null } })
            .exec(async (err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {

                    var tab = [];
                    for (var i = 0; i < result.length; i++) {
                        const tmp2 = await diagnostiqueController.totaleMontant(result[i]._id);
                        totale_chiffre_daffaire += tmp2.totaleTTC;

                        totale_heure_reparation += tmp2.totaleReparation;
                        totale_nb_reparation += 1;
                    }
                    moyen_heure_reparation = round(((totale_heure_reparation) / totale_nb_reparation), 2);

                    resolve({ status: 200, totale_temps_reparation: totale_heure_reparation, totale_nb_reparation: totale_nb_reparation, moyen_temps_reparation: moyen_heure_reparation, chiffre_daffaire: totale_chiffre_daffaire });
                }
            });
    });
};


exports.totaleChiffreAffaireFilter = (req, res) => {
    return new Promise((resolve, reject) => {
        var filter = null;

        if (req.body.categorie == "DAY") {
            filter = { day: Number(moment(req.body.date).format('DD')) }, { month: Number(moment(req.body.date).format('MM')) }, { year: Number(moment(req.body.date).format('YYYY')) };
        } else if (req.body.categorie == "MONTH") {
            filter = { month: Number(moment(req.body.date).format('MM')) }, { year: Number(moment(req.body.date).format('YYYY')) };
        } else {
            filter = { year: Number(moment(req.body.date).format('YYYY')) };
        }

        var totale_chiffre_daffaire = 0;
        var moyen_heure_reparation = 0;
        var totale_heure_reparation = 0;
        var totale_nb_reparation = 0;
        Reparationdb.aggregate([
            {
                $project:
                {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    week: { $week: "$createdAt" },
                    employe: 1,
                    facture: 1,
                    _id: 1
                }
            },
            {
                $match: {
                    $and: [
                        { employe: { $ne: null } }, { facture: { $ne: null } }, filter
                    ]
                }
            }
        ])
            .exec(async (err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {
                    var tab = [];
                    for (var i = 0; i < result.length; i++) {
                        const tmp2 = await diagnostiqueController.totaleMontant(result[i]._id);
                        totale_chiffre_daffaire += tmp2.totaleTTC;
                        totale_heure_reparation += tmp2.totaleReparation;
                        totale_nb_reparation += 1;
                    }
                    moyen_heure_reparation = round(((totale_heure_reparation) / totale_nb_reparation), 2);
                    resolve({ status: 200, totale_temps_reparation: totale_heure_reparation, totale_nb_reparation: totale_nb_reparation, moyen_temps_reparation: moyen_heure_reparation, chiffre_daffaire: totale_chiffre_daffaire });

                }
            });
    });
};

exports.findAllReparationFacturer = () => {
    return new Promise((resolve, reject) => {

        Reparationdb.find({ employe: { $ne: null }, facture: { $ne: null } })
            .populate({
                path: 'voiture',
                populate: {
                    path: 'client'
                }
            })
            .populate({
                path: 'employe'
            })
            .populate({
                path: 'facture'
            })
            .exec(async (err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {

                    var tab = [];
                    for (var i = 0; i < result.length; i++) {
                        const tmp = await diagnostiqueController.estimationReparation(result[i]._id);
                        const tmp2 = await diagnostiqueController.totaleMontant(result[i]._id);
                        tab.push({ data: result[i], pourcentage: tmp.pourcentage, temps_reparation: tmp2.totaleReparation, montant: tmp2.totaleTTC });
                    }
                    resolve(tab);
                }
            });
    });
};

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Reparationdb.findById(id)
            .populate({
                path: 'voiture',
                populate: {
                    path: 'client'
                }
            })
            .populate({
                path: 'employe'
            })
            .exec((err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {
                    resolve(result);
                }
            });
    });
};

exports.findFactureByReparation = (id) => {
    return new Promise((resolve, reject) => {
        Reparationdb.findById(id)
            .populate({
                path: 'voiture',
                populate: {
                    path: 'client'
                }
            })
            .populate({
                path: 'employe'
            })
            .populate({
                path: 'facture'
            })
            .exec((err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {
                    resolve(result);
                }
            });
    });
};

exports.findAllReparationAttente = () => {
    return new Promise((resolve, reject) => {
        Reparationdb.find({ status: false })
            .populate({
                path: 'voiture',
                populate: {
                    path: 'client'
                }
            })
            .exec((err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {
                    resolve(result);
                }
            });
    });
};

exports.findAllReparationReceptionner = (user_id) => {
    return new Promise(async (resolve, reject) => {
        const emp = await Employedb.findOne({ user: user_id });

        Reparationdb.find({ employe: emp._id, start: false })
            .populate({
                path: 'voiture',
                populate: {
                    path: 'client'
                }
            })
            .populate({
                path: 'employe'
            })
            .exec((err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {

                    resolve(result);
                }
            });
    });
};


exports.valider_sortir = (req, res) => {
    const dataUpdated = {
        release_date: req.body.release_date,
    };

    Reparationdb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
        if (err) {
            res.send({ status: 404, message: "La modification a échoué!" });
        } else {
            Voituredb.findById(doc.voiture).then((vtre) => {

                Clientdb.findById(vtre.client).then((cli) => {
                    authentificationMail.sendMailSortirVehicule(cli.email, cli.name + " " + cli.username, "Sortir du voiture le " + dataUpdated.release_date, vtre.matricule, "http://localhost:3000/liste-reparation/" + "terminer", dataUpdated.release_date)
                        .then((val) => {
                            res.send(val);
                        }).catch((errS) => {
                            res.send(errS);
                        });

                }).catch((er) => {
                    console.log(er.message)
                    res.send({ status: 400, message: "Une erreur s'est produit lors du retournement du donnée client" });
                });
            }).catch((erV) => {
                res.send({ status: 400, message: erV.message });
            });
        }
    });
};

exports.valider_facture = (reparation_id, facture_) => {
    return new Promise((resolve, reject) => {
        const dataUpdated = {
            facture: facture_,
        };
        console.log(dataUpdated)
        if (dataUpdated.facture != null) {
            Reparationdb.findByIdAndUpdate(reparation_id, dataUpdated, { upsert: true }, function (err, doc) {
                if (err) {
                    reject({ status: 404, message: "La modification a échoué!" });
                } else {
                    console.log("success insert reparation facture");
                    resolve({ status: 200, message: 'Facture validé!' });
                }
            });
        } else {
            reject({ status: 400, message: " champs invalide !" });
        }
    });

};

exports.startReparation = async (req, res) => {

    const dataUpdated = {
        start: true
    };
    if (dataUpdated.start == true) {
        Reparationdb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {

                console.log('La modification a échoué! ');
                res.send({ status: 404, message: "La modification a échoué!" });
            } else {
                console.log('information a été modifié avec success!');
                res.send({ status: 200, message: 'information a été modifié avec success!' });
            }
        });
    } else {
        console.log("champs invalide !")
        res.send({ status: 400, message: " champs invalide !" });
    }
};


exports.update = async (req, res) => {
    const dataUpdated = {
        employe: emp._id,
        description: req.body.description,
        status: true,
        release_date: null,
        facture: null,
        start: false
    };
    if (emp._id != null && dataUpdated.status != null) {
        Reparationdb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                res.send({ status: 404, message: "La modification a échoué!" });
            } else {
                Voituredb.findById(doc.voiture).then((vtre) => {

                    Clientdb.findById(vtre.client).then((cli) => {
                        authentificationMail.sendMailAcceptReparationVehicule(cli.email, cli.name + " " + cli.username, vtre.matricule, "http://localhost:3000/login", emp.name)
                            .then((val) => {
                                res.send(val);
                            }).catch((errS) => {
                                res.send(errS);
                            });

                    }).catch((er) => {
                        console.log(er.message)
                        res.send({ status: 400, message: "Une erreur s'est produit lors du retournement du donnée client" });
                    });
                }).catch((erV) => {
                    res.send({ status: 400, message: erV.message });
                });
                res.send({ status: 200, message: 'information a été modifié avec success!' });
            }
        });
    } else {
        res.send({ status: 400, message: " champs invalide !" });
    }
};

