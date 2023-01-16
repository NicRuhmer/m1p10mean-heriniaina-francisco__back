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

exports.create = (req, res) => {
    const new_ = {
        name: req.body.name,
        num_serie: req.body.serie,
        matricule: req.body.matricule,
        genre: req.body.genre,
        client: req.params.id
    };

    if (new_.name != null && new_.num_serie != null && new_.matricule != null && new_.genre != null && new_.client != null) {
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
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};


exports.update = (req, res) => { };
exports.delete = (req, res) => { };