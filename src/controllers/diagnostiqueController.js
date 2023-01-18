var Diagnonstiquedb = require('../models/Diagnostique');
var cReparation = require('./reparationController');
var StatutReparationdb = require('../models/StatutReparation');

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

exports.findData = (reparation_id,identifiant_diagnostique) => {
    return new Promise((resolve, reject) => {
        Diagnonstiquedb.find({reparation:reparation_id})
            .populate({path:"status_reparation",
                match:
                {
                    identifiant:{$eq:identifiant_diagnostique}
                }
            })
            .exec((err,result) => {
                if(err){
                    reject({ status: 400, message: err.message });
                }else {
                    console.log(identifiant_diagnostique,result.length);
                    resolve(result);
                }
               
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


exports.create = async(req, res) => {

    const status = await StatutReparationdb.findOne({identifiant:"isTask"});
    if(status!=null){
        const new_ = {
                title: req.body.title,
                description: req.body.description,
                qte:req.body.qte,
                pu: req.body.montant,
                duration:req.body.duration,
                reparation:req.params.id,
                status_reparation:status._id
            };

        if (new_.title != null && new_.qte != null && new_.pu != null && new_.duration!=null && new_.reparation!=null && new_.status_reparation!=null) {
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
    } else {
        res.send({status:400, message:' erreur lors de retournement de donnée dans status de reparation'});
    }
    
};

exports.update = (req, res) => {
    const dataUpdated = {
        title: req.body.title,
        description: req.body.description,
        qte:req.body.qte,
        pu: req.body.montant,
        duration:req.body.duration
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

exports.updateTask= async(index_,res)=>{

      const status = await StatutReparationdb.findOne({identifiant:index_});
      if(status!=null){
         const dataUpdated = {  status_reparation:status._id  };
         if (dataUpdated.status_reparation != null) {
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

      } else {
            res.send({status:400, message:' erreur lors de retournement de donnée dans status de reparation'});
      }
 
};

exports.isProgress= (req,res)=>{
    if(req.body.diagnostique!=null && req.body.progress==null){

        if(req.body.progress=="isTask"){
            this.updateTask("isTask",res);
        }
        else if(req.body.progress=="isProgress"){
            this.updateTask("isProgress",res);
        } 
        else if(req.body.progress=="isFinish"){
            this.updateTask("isFinish",res);
        }
        else {
               res.send({status:400, message:' erreur lors de retournement des données. Progress not exist: '+req.body.progress});
        }
    } else {
            res.send({status:400, message:' erreur lors de retournement des données. Soit diagnostique soit progress'});
    }
};

