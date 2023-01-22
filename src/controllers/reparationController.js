var Reparationdb = require('../models/Reparation');
var Employedb = require('../models/Employer');

var diagnostiqueController = require('./diagnostiqueController');

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Reparationdb.findById(id)
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

exports.findAllReparationAttente = () => {
    return new Promise((resolve, reject) => {
        Reparationdb.find({status:false})
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
      
        Reparationdb.find({employe:emp._id})
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

exports.findAllReparationEnCour = (user_id) => {
    return new Promise(async(resolve, reject) => {
        const emp = await Employedb.findOne({user:user_id});
      
        Reparationdb.find({employe:emp._id,start:true})
            .populate({ 
                path: 'voiture', 
                populate: { 
                    path: 'client' 
                } 
            })
            .exec(async (err, result) => {
                if (err) {
                    console.log(err.message)
                    reject({ status: 400, message: err.message });
                } else {
                    var tab=[];
                    for (var i = 0; i < result.length; i++) {
                        const tmp = await diagnostiqueController.estimationReparation(result[i]._id);
                        tab.push({data:result[i], pourcentage:tmp.pourcentage});
                    }
                    resolve(tab);
                }
            });
    });
};

exports.create = (req, res) => {
    const new_ = {
        voiture: req.body.voiture,
        client: req.params.id,
        description:req.body.description,
        employe:null,
        status: false,
        start:false
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
         description:req.body.description,
        status: true,
        start:false
    };
    if (emp._id != null && dataUpdated.status != null) {
        Reparationdb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, function (err, doc) {
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

exports.startReparation = async (req, res) => {
   
    const dataUpdated = {
        start:true
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