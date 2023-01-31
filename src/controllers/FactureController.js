var Reparationdb = require('../models/Reparation');
var Facturedb = require('../models/Facture');

var diagnostiqueController = require('./diagnostiqueController');
var reparationController = require('./reparationController');
var authentificationMail = require('./AuthentificationMail');



exports.verifyNumFacture = (req, res) => {
    const fact = req.body.facture;
    Facturedb.exists({ num_facture: fact }).then((exist) => {
        if (exist) {
            res.send({ status: 400, message: 'Le n° facture déjà utilisé!' });
        } else {
            res.send({ status: 200, message: 'N° facture validé!' });
        }
    }).catch((err) => res.send({ status: 400, message: err.message }));
};

exports.save = (new_)=>{
	return new Promise((resolve,reject)=>{
			
	    if (new_.due_date != null && new_.invoice_date != null && new_.num_facture != null && new_.paiement != null) {
	        const new__ = new Facturedb(new_);
	        new__.save((err, docs) => {
	            if (err) {
	                console.log(err.message);
	                reject({ status: 400, message: err.message });
	            } else {
					console.log("success insert facture");
	                resolve({ status: 200, data: docs, message: "Success !" });
	            }
	        });
	    } else {
	        console.log('Champs invalide !');
	        reject({ status: 400, message: "champs invalide!" })
	    }
	});
};

exports.saveFacture = async(req, res) => {
	var $this = this;

 	const new_ = {
	        due_date: req.body.due_date,
	        invoice_date: req.body.invoice_date,
	        num_facture: req.body.facture,
			paiement: req.body.paiement,
			status:false
		    };

	const reparation = await reparationController.findById(req.params.id);
    $this.save(new_).then((result)=>{
		reparationController.valider_facture(req.params.id,result.data._id).then((finish)=>{
			authentificationMail.sendMailCreationFacture(reparation.voiture.client.email,  reparation._id,reparation.voiture.matricule, "http://51.178.17.54:3001/detail/" +req.params.id+ "/facture")
            .then((val) => {
                res.send(val);
                }).catch((errS) => {
                    res.send(errS);
                });
    	}).catch((Errrep)=>{
		  	res.send({ status: 400, message: Errrep.message });
    	});
    }).catch((err)=>{
		res.send({ status: 400, message: err.message });
	});

};