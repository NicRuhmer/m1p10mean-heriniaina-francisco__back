var Diagnonstiquedb = require('../models/Diagnostique');
var cReparation = require('./reparationController');
var StatutReparationdb = require('../models/StatutReparation');
const { ObjectId } = require("mongodb");
const Reparationdb = require('../models/Reparation');

exports.findAll = (reparation_id) => {
    return new Promise((resolve, reject) => {
        Diagnonstiquedb.find({ reparation: reparation_id })
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject({ status: 400, message: err.message });
            });
    });
};




function round(num, decimalPlaces = 0) {
    num = Math.round(num + "e" + decimalPlaces);
    return Number(num + "e" + -decimalPlaces);
}

exports.findData = (reparation_id, identifiant_diagnostique) => {
    return new Promise(async (resolve, reject) => {
        const status_reparation_ = await StatutReparationdb.findOne({ identifiant: identifiant_diagnostique });
        var totaleInit = await Diagnonstiquedb.countDocuments({ reparation: reparation_id });
        var pourcentInit = 100;
        Diagnonstiquedb.find({ reparation: reparation_id, status_reparation: status_reparation_._id })
            .populate('status_reparation')
            .exec((err, result) => {
                if (err) {
                    reject({ status: 400, message: err.message });
                } else {
                    var pourcentage_ = ((result.length * pourcentInit) / totaleInit);

                    resolve({ data: result, pourcentage: round(pourcentage_, 2) });
                }

            });
    });
};

exports.getPourcentageProgress = (reparation_id, identifiant_diagnostique) => {
    return new Promise(async (resolve, reject) => {
        const status_reparation_ = await StatutReparationdb.findOne({ identifiant: identifiant_diagnostique });
        var totaleInit = await Diagnonstiquedb.countDocuments({ reparation: reparation_id });
        var pourcentInit = 100;
        Diagnonstiquedb.find({ reparation: reparation_id, status_reparation: status_reparation_._id })
            .then((result) => {
                var pourcentage_ = ((result.length * pourcentInit) / totaleInit);
                resolve({ pourcentage: round(pourcentage_, 2) });

            }).catch((err) => {
                reject({ status: 400, message: err.message });
            });
    });
};

exports.estimationReparation = (reparation_id_) => {
    return new Promise(async (resolve, reject) => {
        const finish_ = await StatutReparationdb.findOne({ identifiant: "isFinish" });
        var totaleInit = await Diagnonstiquedb.countDocuments({ reparation: reparation_id_ });
        var pourcentInit = 100;
        var pourcentage_finish = 0;
        var pourcent = 0;
        const finish = await Diagnonstiquedb.countDocuments({ reparation: reparation_id_, status_reparation: finish_._id });
        if (finish > 0 && totaleInit > 0) {
            pourcentage_finish = ((finish * pourcentInit) / totaleInit);
            var tmp = round(pourcentage_finish, 2);
            if (tmp != null) {
                var pourcent = tmp;
            }
        }
        resolve({ reparation_id: reparation_id_, pourcentage: pourcent });

    }).catch(err => {
        reject({ status: 400, message: err.message });
    });
}

/*
exports.totaleChiffreAffaire = () => {
    return new Promise(async (resolve, reject) => {
        var totaleht = 0;
        var totaletva = 0;
        var tabTva_ = [];
        Diagnonstiquedb.aggregate(
            [
              {
                    $group:
                    {
                        _id:0,
                        'totaleHt': { $sum:{ $multiply: ['$pu', '$qte'] } },
                        'totalTvaInit':{$sum: { $multiply: ['$pu', '$qte','$tva'] }}
                    }
                },
                { $project: { 
                    _id: 1,
                    totaleHt: 1,
                    totaleTva: { $divide: [ "$totalTvaInit", 100 ] } } 
                }
            ]
        ).then((totale) => {
            totaleht = totale[0].totaleHt;
            totaletva = totale[0].totaleTva;
           resolve({status:200, chiffre_affaire:(totaleht+totaletva)});

        }).catch((err) => {
            reject({ status: 400, message: err.message });
        });
    });
};*/

/*
exports.totaleMontant = (reparation_id_) => {
    return new Promise(async (resolve, reject) => {
        var totaleht = 0;
        var totaletva = 0;
        var tabTva_ = [];
        Diagnonstiquedb.aggregate(
            [
              {
                    $group:
                    {
                        _id:{reparation_id:reparation_id_},
                        'totaleHt': { $sum:{ $multiply: ['$pu', '$qte'] } },
                        'totalTvaInit':{$sum: { $multiply: ['$pu', '$qte','$tva'] }}
                    }
                },
                { $project: { 
                    _id: 1,
                    totaleHt: 1,
                    totaleTva: { $divide: [ "$totalTvaInit", 100 ] } } 
                }
            ]
        ).then((totale) => {
            totaleht = totale[0].totaleHt;
            totaletva = totale[0].totaleTva;
            Diagnonstiquedb.aggregate([
                {
                    $group:
                    {
                        _id: { reparation: reparation_id_, tva: "$tva" },
                        'totalTvaInit':{$sum: { $multiply: ['$pu', '$qte','$tva'] }}
                    }
                },
                {
                    $project:{
                        _id:1,
                        totaleTva: { $sum:{$divide: [ "$totalTvaInit", 100 ] } } 
                    }
                }
            ]).then((totale2) => {
                    for(var id=0;id<totale2.length;id++){
                        tabTva_.push({description:"TVA "+totale2[id]._id.tva+"%",totaleTva:totale2[id].totaleTva});
                    }
                    resolve({totaleHT:totaleht,totaleTTC:(totaleht+totaletva), totaleTVA:totaletva, tabTva:tabTva_});
            });

        }).catch((err) => {
            reject({ status: 400, message: err.message });
        });
    });
};
*/


exports.totaleMontant = (reparation_id_) => {
    return new Promise(async (resolve, reject) => {
        var totaleht = 0;
        var totaletva = 0;
        var totaleHeure = 0;
        var tabTva_ = [];
        Diagnonstiquedb.aggregate(
            [

                {
                    $group:
                    {
                        _id: { reparation: '$reparation' },
                        'totaleDuration': { $sum: '$duration' },
                        'totaleHt': { $sum: { $multiply: ['$pu', '$qte'] } },
                        'totalTvaInit': { $sum: { $multiply: ['$pu', '$qte', '$tva'] } }
                    }
                },
                {
                    $project: {
                        reparation: '$_id.reparation',
                        totaleHt: 1,
                        totalTvaInit: 1,
                        totaleDuration: 1,
                        // tva: 1,
                        // pu: 1,
                        totaleTva: { $divide: ["$totalTvaInit", 100] }
                    }
                },
                {
                    $match: {
                        reparation: new ObjectId("" + reparation_id_)
                    }
                }
            ]
        ).then((totale) => {
         
            if (totale.length > 0) {
                if (totale[0].totaleDuration != null && totale[0].totaleHt != null && totale[0].totaleTva != null) {
                    totaleHeure = totale[0].totaleDuration;
                    totaleht = totale[0].totaleHt;
                    totaletva = totale[0].totaleTva;
                }
            }
            Diagnonstiquedb.aggregate([
                {
                    $match: {
                        reparation: new ObjectId("" + reparation_id_)
                    }
                }, {
                    $group:
                    {
                        _id: { tva: "$tva" },
                        'totalTvaInit': { $sum: { $multiply: ['$pu', '$qte', '$tva'] } }
                    }
                },
                {
                    $project: {
                        'tva': '$_id.tva',
                        totaleTva: { $sum: { $divide: ["$totalTvaInit", 100] } }
                    }
                }
            ]).then((totale2) => {
                for (var id = 0; id < totale2.length; id++) {
                    tabTva_.push({ description: "TVA " + totale2[id]._id.tva + "%", totaleTva: totale2[id].totaleTva });
                }
                resolve({ totaleReparation: totaleHeure, totaleHT: totaleht, totaleTTC: (totaleht + totaletva), totaleTVA: totaletva, tabTva: tabTva_ });
            });

        }).catch((err) => {
            reject({ status: 400, message: err.message });
        });
    });
};


exports.findById = (id_) => {
    return new Promise(async (resolve, reject) => {
        Diagnonstiquedb.findById(id_)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject({ status: 400, message: err.message });
            });
    });
};


exports.create = async (req, res) => {

    const status = await StatutReparationdb.findOne({ identifiant: "isTask" });
    if (status != null) {
        const new_ = {
            title: req.body.title,
            description: req.body.description,
            qte: req.body.qte,
            pu: req.body.montant,
            duration: req.body.duration,
            reparation: req.params.id,
            status_reparation: status._id,
            unite: req.body.unite,
            tva: 20
        };

        if (new_.title != null && new_.qte != null && new_.unite != null && new_.pu != null && new_.duration != null && new_.reparation != null && new_.status_reparation != null) {
            const new__ = new Diagnonstiquedb(new_);
            new__.save((err, docs) => {
                if (err) {
                    console.log(err.message);
                    res.send({ status: 400, message: err.message });
                } else {
                    this.findAll(req.params.id).then((result) => {
                        res.send({ status: 200, data: result, message: "Success !" });
                    });

                }
            });
        } else {
            console.log('Champs invalide !');
            res.send({ status: 400, message: "champs invalide!" })
        }
    } else {
        res.send({ status: 400, message: ' erreur lors de retournement de donnée dans status de reparation' });
    }

};


exports.update = (req, res) => {
    var $this=this;
    const dataUpdated = {
        title: req.body.title,
        description: req.body.description,
        qte: req.body.qte,
        pu: req.body.montant,
        duration: req.body.duration,
        unite: req.body.unite,
        tva: 20
    };
    if (dataUpdated.title != null && dataUpdated.qte != null && dataUpdated.pu != null && dataUpdated.duration != null) {
        Diagnonstiquedb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                res.send({ status: 400, message: "La modification a échoué!" });
            } else {
                console.log(doc);
                $this.findAll(doc.reparation).then((result) => {
                    res.send({ status: 200, data: result, message: "Success !" });
                });
                // res.send({ status: 200, message: 'information a été modifié avec success!' });
            }
        });
    } else {
        res.send({ status: 400, message: " champs invalide !" });
    }
};


exports.updateFacture = (req, res) => {
    const dataUpdated = {
        title: req.body.title,
        qte: req.body.qte,
        pu: req.body.montant,
        unite: req.body.unite,
        tva: req.body.tva
    };
    if (dataUpdated.title != null && dataUpdated.qte != null && dataUpdated.pu != null && dataUpdated.unite != null && dataUpdated.tva != null) {
        Diagnonstiquedb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                res.send({ status: 400, message: "La modification a échoué!" });
            } else {
                res.send({ status: 200, message: 'information a été modifié avec success!' });
            }
        });
    } else {
        res.send({ status: 400, message: " champs invalide !" });
    }
};

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        Diagnonstiquedb.findByIdAndDelete(id).then((result) => {
            resolve({ status: 200, message: 'Suppression terminé !' })
        }).catch((err) => {
            reject({ status: 400, message: err.message });
        });
    });

};

exports.updateTask = async (index_, req, res) => {
    var $this = this;
    const status = await StatutReparationdb.findOne({ identifiant: index_ });
    if (status != null) {
        const dataUpdated = { status_reparation: status._id };
        if (dataUpdated.status_reparation != null) {
            Diagnonstiquedb.findByIdAndUpdate(req.body.diagnostique, dataUpdated, async function (err, doc) {
                if (err) {
                    res.send({ status: 400, message: "La modification a échoué!" });
                } else {
                    const pourcent_task_ = await $this.getPourcentageProgress(doc.reparation, 'isTask');
                    const pourcent_progress_ = await $this.getPourcentageProgress(doc.reparation, 'isProgress');
                    const pourcent_finish_ = await $this.getPourcentageProgress(doc.reparation, 'isFinish');

                    res.send({ pourcent_task: pourcent_task_.pourcentage, pourcent_progress: pourcent_progress_.pourcentage, pourcent_finish: pourcent_finish_.pourcentage, status: 200, message: 'information a été modifié avec success!' });
                }
            });
        } else {
            res.send({ status: 400, message: " champs invalide !" });
        }

    } else {
        res.send({ status: 400, message: ' erreur lors de retournement de donnée dans status de reparation' });
    }

};

exports.isProgress = (req, res) => {

    if (req.body.diagnostique != null && req.body.progress != null) {

        if (req.body.progress == "isTask") {
            this.updateTask("isTask", req, res);
        }
        else if (req.body.progress == "isProgress") {
            this.updateTask("isProgress", req, res);
        }
        else if (req.body.progress == "isFinish") {
            this.updateTask("isFinish", req, res);
        }
        else {
            res.send({ status: 400, message: ' erreur lors de retournement des données. Progress not exist: ' + req.body.progress });
        }
    } else {
        res.send({ status: 400, message: ' erreur lors de retournement des données. Soit diagnostique soit progress' });
    }
};

