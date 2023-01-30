var cUser = require('./userController');
var Employerdb = require('../models/Employer');
const Userdb = require('../models/User');

exports.findViewEmployer = () => {
return new Promise((resolve, reject) => {
        Employerdb.find()
            .populate({ path: 'user', populate: { path: 'role' } })
            .exec((err, repertoir) => {
                if (!err) {
                    console.log(repertoir);
                    resolve(repertoir);
                } else {
                    reject({ status: 500, message: err.message });
                }
            });

    });
};

exports.getResponsable = () => {
    var $this = this;
    return new Promise(async (resolve, reject) => {
        var tabInactive = [];
        var tabactive = [];
        var tab = [];

        $this.findViewEmployer().then((result) => {
            for (let index = 0; index < result.length; index++) {
                const element = result[index];
                if (element.user.status == false) {
                    tabInactive.push(element);
                }
                if (element.user.status == true) {
                    tabactive.push(element);
                }
            }
         
            resolve({responsable_inactive:tabInactive,responsable_active:tabactive});
        }).catch((err)=>{
            reject(err);
        });
    });
};

exports.findAll = () => {
    return new Promise((resolve, reject) => {
        Employerdb.find()
            .populate({ path: 'user', populate: { path: 'role' } })
            .exec((err, repertoir) => {
                if (!err) {
                       resolve(repertoir);
              
                } else {
                        reject({ status: 500, message: err.message });
                }
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


exports.create = (name_, contact_, adrs_, email_, salaire_, user_id) => {

    return new Promise((resolve, reject) => {

        const new_ = {
            name: name_,
            contact: contact_,
            adresse: adrs_,
            email: email_,
            salaire: salaire_,
            user: user_id
        };

        const newEmploye = new Employerdb(new_);
        console.log(newEmploye);
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

    cUser.saveNewResp(req.body.nicname, req.body.username, req.body.password, req.body.role).then((data) => {
        this.create(req.body.nicname, req.body.contact, req.body.adresse, req.body.username, req.body.salaire, data.result._id).then((val) => {
            // this.create("Resp.Financier", "032 56 478 95", "IVG", "financier@responsable.com", 2000, "63c281b71177ef3681928aac").then((val) => {

            res.send({ status: 200, message: 'Success !' });
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
    }).catch((err2) => {
        res.send({ status: 400, message: err2.message });
    });
};



exports.update = async (req, res) => {

    const emp = await Employerdb.findById(req.params.id);
    const dataUpdated = {
        name: req.body.nicname,
        contact: req.body.contact,
        adresse: req.body.adresse,
        email: req.body.username,
        salaire: req.body.salaire
    };
    cUser.update(emp.user, req.body.nicname, req.body.username).then((result) => {
        if (result != null) {
            Employerdb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, async function (err, doc) {
                if (err) {
                    res.send({ status: 400, message: "La modification a échoué!" });
                } else {
                    Userdb.findByIdAndUpdate(emp.user, { nicname: dataUpdated.name, username: dataUpdated.email }, { upsert: true }, function (err2, doc2) {
                        if (err2) {
                            res.send({ status: 400, message: err2.message });
                        } else {
                            res.send({ status: 200, message: 'information a été modifié avec success!' });
                        }
                    });

                }
            });
        }
    });
};

exports.delete = async (req, res) => {
    const emp = await Employerdb.findById(req.body.employe);
    await Userdb.findByIdAndDelete(emp.user);
    Employerdb.findByIdAndDelete(emp.user).then((result) => {
        res.send({ status: 200, message: 'Suppression terminé !' })
    }).catch((err) => {
        res.send({ status: 404, message: err.message });
    });
}
