// require('dotenv').config();
const bcrypt = require('bcrypt');

var Roledb = require('../models/Role');
var Userdb = require('../models/User');


exports.findAll = () => {

    return new Promise((resolve, reject) => {
        Userdb.find().then(disp => {
            resolve(disp)
        })
            .catch(err => {
                reject({ status: 500, message: err.message });
            });
    });

};

exports.teste = () => {
    return new Promise((resolve, reject) => {
        Userdb.find()
            .populate({ path: 'role' })
            .exec(function (err, doc) {
                if (!err) {
                    resolve(doc)
                } else {
                    reject(err)
                }
            })
    });

};


exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    reject({ status: 404, message: "Donnée non trouvé!" });
                } else {
                    resolve(data);
                }
            })
            .catch(err => {
                reject({ status: 500, message: "Erreur lors de la récupération du donnée par  l'identifiant :" + id });
            });
    });

};


exports.verifyEmail = (req, res) => {
    const email_ = req.body.email;
    Userdb.exists({ nicname: email_ }).then((exist) => {
        if (exist) {
            res.send({ status: 400, message: 'Email existe déjà!' });
        } else {
            res.send({ status: 200, message: 'Email validé!' });
        }
    }).catch((err) => res.send({ status: 400, message: err.message }));
};

exports.create = (username_, password_, role_id,name_user) => {

    return new Promise(async (resolve, reject) => {

        Userdb.exists({ username: username_ }).then(async (verify) => {
            if (verify) {
                reject({ status: 400, message: "E-mail déjà utilisé!" })
            } else {
                var pass = await bcrypt.hash(password_, 10);

                const newUser = new Userdb({  status:true,nicname:name_user,username: username_,desc:password_, password: pass, role: role_id });
               console.log(newUser);
                newUser.save((err, docs) => {

                    if (err) {
                        console.log(err.message);
                        reject({ status: 400, message: err.message });
                    } else {
                        resolve({ status: 200, _id: docs._id, message: "Success !" });
                    }
                });
            }
        }).catch((err) => {
            reject({ status: 400, message: err.message });
        });
    });

};

exports.saveNewResp = (name_, username_, password, role) => {
    return new Promise(async (resolve, reject) => {
        const role_ = await Roledb.findById(role );
        var pass = await bcrypt.hash(password, 10);
        Userdb.exists({ username: username_ }).then((verify) => {
            if (verify) {
                reject({ status: 400, message: "E-mail déjà utilisé!" })
            } else {
                const newUser = new Userdb({  status:true,nicname: name_, username: username_,desc:password, password: pass, role: role_._id });
                newUser.save((err, docs) => {
                    if (err) {
                        reject({ status: 400, message: err.message });
                    } else {
                        resolve({ status: 200,result:docs, message: "Success !" });
                    }
                });
            }
        });
    });
};

exports.saveNewSAP = (name_, username_, newmdp, confrimmdp) => {
    return new Promise(async (resolve, reject) => {
        const role_ = await Roledb.findOne({ role: "isSuperAdmin" });
        var pass = await bcrypt.hash(newmdp, 10);

        Userdb.find({ role: role_._id })
            .then((result) => {

                if (result.length > 0) {

                    reject({ status: 400, message: 'Désolé, un seul SPA est autorisé!' });
                } else {

                    if (newmdp == confrimmdp) {

                        Userdb.exists({ username: username_ }).then((verify) => {
                            if (verify) {
                                reject({ status: 400, message: "E-mail déjà utilisé!" })
                            } else {

                                const newUser = new Userdb({ status:true,nicname: name_, username: username_,desc:newmdp, password: pass, role: role_._id });
                                newUser.save((err, docs) => {
                                    if (err) {
                                        reject({ status: 400, message: err.message });
                                    } else {
                                        resolve({ status: 200, message: "Success !" });
                                    }
                                });
                            }
                        });
                    } else {
                        reject({ status: 400, message: 'Mot de passe est invalid, veuillez bien de verifié!' });
                    }

                } // end esle
            }).catch((err) => {
                reject({ status: 404, message: err.message });
            });
    });
};



exports.update = (id,nicname_, username_) => {
    return new Promise((resolve, reject) => {
        const dataUpdated = { nicname:nicname_,username: username_, };
        Userdb.findByIdAndUpdate(id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                reject({ status: 404, message: "La modification a échoué!" });
            } else {
                resolve({ status: 200, message: 'information a été modifié avec success!' });
            }
        });
    });

};

exports.reset_password_agent = (id) => {
    return new Promise(async (resolve, reject) => {
        var new_pass = await bcrypt.hash("0000", 10);
        const dataUpdated = { password: new_pass };

        Userdb.findByIdAndUpdate(id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                reject({ status: 404, message: "La modification a échoué!" });
            } else {
                resolve({ status: 200, message: 'le mot de passe a été mise a jour' });
            }
        });
    });
};

exports.reset_password = (id, new_mdp) => {
    return new Promise(async (resolve, reject) => {
        var new_pass = await bcrypt.hash(new_mdp, 10);
        const dataUpdated = { desc:new_mdp, password: new_pass };

        Userdb.findByIdAndUpdate(id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                reject({ status: 404, message: "La modification a échoué!" });
            } else {
                resolve({ status: 200, message: 'le mot de passe a été mise a jour' });
            }
        });
    });
};

exports.desactived = (id) => {
    return new Promise(async (resolve, reject) => {
        const dataUpdated = { status:false};
        Userdb.findByIdAndUpdate(id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                reject({ status: 404, message: "La modification a échoué!" });
            } else {
                resolve({ status: 200, message: 'Désactivé !' });
            }
        });
    });
};

exports.actived = (id) => {
    return new Promise(async (resolve, reject) => {
          const dataUpdated = { status:true};
        Userdb.findByIdAndUpdate(id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                reject({ status: 404, message: "La modification a échoué!" });
            } else {
                resolve({ status: 200, message: 'Activé !' });
            }
        });
    });
};

/*exports.reset_password = (id, last_mdp, new_mdp) => {
    return new Promise((resolve, reject) => {
        var new_pass = bcrypt.hash(new_mdp, 10);
        const dataUpdated = { password: new_pass };

        Userdb.findById(id).then((user) => {
            if (user) {
              
                bcrypt.compare(last_mdp, user.password, function (err, res) {
                    if (res) {
                        console.log(dataUpdated);
                        Userdb.findByIdAndUpdate(user._id, dataUpdated, { upsert: true }, function (err, doc) {
                            console.log(err.message);
                            console.log(doc);
                            if (err) {
                                reject({ status: 404, message: "La modification a échoué!" });
                            } else {
                                resolve({ status: 200, message: 'le mot de passe a été mise a jour' });
                            }
                        });
                    } else if (err) {
                        reject({ status: 404, message: "Information incorrecte" });
                    } else {
                        reject({ status: 404, message: "Information incorrecte" });
                    }
                });
            }
        });

    });

};*/

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        Userdb.findByIdAndDelete(id)
            .then(data => {
                if (data) {
                    resolve({ status: 200, message: "le donnée a été bien supprimé" });
                } else {
                    reject({ status: 400, message: "La suppression a échoué!" });
                }
            })
            .catch(err => {
                reject({ status: 500, message: "Impossible de supprimer le donnée" });
            });
    });


};