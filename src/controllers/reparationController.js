var cUser = require('./userController');
var Clientdb = require('../models/Client');
var Voituredb = require('../models/Voiture');
var Reparationdb = require('../models/Reparation');
var Employedb = require('../models/Employer');
exports.findAllReparationAttente = () => {
    return new Promise((resolve, reject) => {
        Reparationdb.find({client:null})
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
    return new Promise(async(resolve, reject) => {
        const emp = await Employedb.findOne({user:user_id});
        Reparationdb.find({client:emp._id})
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


exports.create = (req, res) => {
    const new_ = {
        voiture: req.body.voiture,
        client: req.params.id,
        status: false
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

exports.update = async (req, res) => {
    const emp = await Employedb.findOne({ user: req.user._id });
    const dataUpdated = {
        employe: emp._id,
        status: true
    };
    if (dataUpdated.employe != null && dataUpdated.status != null) {
        Reparationdb.findByIdAndUpdate(req.body.id, dataUpdated, { upsert: true }, function (err, doc) {
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