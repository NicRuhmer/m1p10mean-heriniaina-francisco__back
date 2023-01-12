var cUser = require('./userController');
var Employerdb = require('../models/Employer');

exports.findViewEmployer = () => {

    return new promise((resolve, reject) => {
        Employerdb.find()
            .populate({ path: 'user', populate: { path: 'role' } })
            .exec((err, data) => {
                if (!err) {
                    resolve(data);
                } else {
                    console.log(err.message);
                    reject(err);
                }
            });
    });

};


exports.findAll = () => {
    return new Promise((resolve, reject) => {
        Employerdb.find().then(repertoir => {
            resolve(repertoir)
        })
            .catch(err => {
                reject({ status: 500, message: err.message });
            });
    });
};

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Employerdb.findById(id)
            .then(data => {
                if (!data) {
                    reject({ status: 404, message: "Contact non trouvé!" });
                } else {
                    resolve(data);
                }
            })
            .catch(err => {
                reject({ status: 500, message: "Erreur lors de la récupération du contact avec l'identifiant :" + id });
            });
    });
};


exports.create = (name_, cin_, contact_, adrs_, email_, salaire_, user_id) => {

    return new Promise((resolve, reject) => {

        const new_ = {
            name: name_,
            cin: cin_,
            contact: contact_,
            adresse: adrs_,
            email: email_,
            salaire: salaire_,
            user: user_id
        };

        const newEmploye = new Employerdb(new_);
        newEmploye.save((err, docs) => {
            if (err) {
                reject({ status: 400, message: err.message });
            } else {
                resolve({ status: 200, data: docs, message: "Success !" });
            }
        });
    });
};


exports.new_resp = (req, res) => {
    cUser.saveNewResp(req.body.name, req.body.email, req.body.password, req.body.role).then((data) => {
        this.create(req.body.name, req.body.cin, req.body.contact, req.body.adresse, req.body.email, req.body.salaire, data.result._id).then((val) => {
            res.send({ status: 200, message: 'Success !' });
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
    }).catch((err2) => {
        res.send({ status: 400, message: err2.message });
    });
};

