var cUser = require('./userController');
var Clientdb = require('../models/Client');
var Voituredb = require('../models/Voiture');

exports.findAll = (req, res) => {
    Voituredb.find({ client: req.params.id })
        .then((data_) => {
            res.send({ status: 200, data: data_ });
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
};
exports.findById = (req, res) => {
    Voituredb.findById(req.params.id)
        .then((data_) => {
            res.send({ status: 200, data: data_ });
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
};

exports.create = async (req, res) => {
    const new_ = {
        description: req.body.name,
        carburant: req.body.carburant,
        matricule: req.body.matricule,
        genre: req.body.model,
        client: req.params.id
    };

    if (new_.description != null && new_.carburant != null && new_.matricule != null && new_.genre != null && new_.client != null) {

        var vehicule = await Voituredb.findOne({ matricule: new_.matricule });
        if (vehicule != null) {
            res.send({ status: 400, message: "Matricule déjà utilisé !" })
        } else {
            const new__ = new Voituredb(new_);
            new__.save((err, docs) => {
                if (err) {
                    console.log(err.message);
                    res.send({ status: 400, message: err.message });
                } else {
                    console.log('Success !');
                    res.send({ status: 200, data: docs, message: "Success !" });
                }
            });
        }
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};


exports.update = (req, res) => {
    const dataUpdated = {
        description: req.body.name,
        carburant: req.body.carburant,
        matricule: req.body.matricule,
        genre: req.body.model,
    };
    if (dataUpdated.description != null && dataUpdated.carburant != null && dataUpdated.matricule != null && dataUpdated.genre != null) {
        Voituredb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                res.send({ status: 400, message: "La modification a échoué!" });
            } else {
                res.send({ status: 200, message: 'information a été modifié avec success!' });
            }
        });
    } else {
        res.send({ status: 400, message: " Champs invalide !" });
    }
};

exports.delete = (req, res) => {
    if (req.params.id != null) {
        Voituredb.findByIdAndDelete(req.params.id).then((result) => {
            res.send({ status: 200, message: 'Suppression terminé !' })
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
    } else {
        res.send({ status: 400, message: " Champs invalide !" });
    }

};