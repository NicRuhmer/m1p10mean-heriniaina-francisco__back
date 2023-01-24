var Reparationdb = require('../models/Reparation');
var Employedb = require('../models/Employer');
var Clientdb = require('../models/Client');
var Voituredb = require('../models/Voiture');

var diagnostiqueController = require('./diagnostiqueController');
var reparationController = require('./reparationController');
var authentificationMail = require('./AuthentificationMail');


exports.save = (new_)=>{
	return new Promise((resolve,reject)=>{
			

	    if (new_.due_date != null && new_.invoice_date != null && new_.num_facture != null) {
	        const new__ = new Reparationdb(new_);
	        new__.save((err, docs) => {
	            if (err) {
	                console.log(err.message);
	                reject({ status: 400, message: err.message });
	            } else {
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
	        num_facture: req.body.facture
		    };

	const reparation = await reparationController.findById(req.params.id);
    $this.save(new_).then((result)=>{
    	reparationController.valider_facture(req.body.facture).then((finish)=>{
    		authentificationMail.sendMailCreationFacture(reparation.client.email,  reparation._id,reparation.voiture.matricule, "http://localhost:3000/detail/" +req.params.id+ "/facture")
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