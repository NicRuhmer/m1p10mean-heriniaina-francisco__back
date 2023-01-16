var Diagnonstiquedb = require('../models/Diagnostique');
var cReparation = require('./reparationController');

exports.findAll = (reparation_id) => {
    return new Promise((resolve, reject) => {
        Diagnonstiquedb.find({reparation:reparation_id})
            .then((result) => {
                resolve(result);
            }).catch((err)=>{
                reject({ status: 400, message: err.message });
            });
    });
};


exports.findById = (id_) => {
    return new Promise(async(resolve, reject) => {
        Diagnonstiquedb.findById(id_)
            .then((result) => {
                resolve(result);
            }).catch((err)=>{
                reject({ status: 400, message: err.message });
            });
    });
};


exports.create = (req, res) => {
    const new_ = {
        title: req.body.title,
        description: req.body.description,
        qte:req.body.qte,
        pu: req.body.montant,
        duration:req.body.duration,
        reparation:req.params.id,
        facture:null
    };

    if (new_.title != null && new_.qte != null && new_.pu != null && new_.duration!=null && new_.reparation!=null) {
        const new__ = new Diagnonstiquedb(new_);
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

exports.update = (req, res) => {
    const dataUpdated = {
        title: req.body.title,
        description: req.body.description,
        qte:req.body.qte,
        pu: req.body.montant,
        duration:req.body.duration,
        facture:null
    };
     if (dataUpdated.title != null && dataUpdated.qte != null && dataUpdated.pu != null && dataUpdated.duration!=null) {
        Diagnonstiquedb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                res.send({ status: 404, message: "La modification a échoué!" });
            } else {
                res.send({ status: 200, message: 'information a été modifié avec success!' });
            }
        });
    } else {
        res.send({ status: 400, message: " champs invalide !" });
    }
};

exports.delete = (req,res)=>{
    Diagnonstiquedb.findByIdAndDelete(req.params.id).then((result) => {
        res.send({ status: 200, message: 'Suppression terminé !' })
    }).catch((err) => {
        res.send({ status: 404, message: err.message });
    });
};