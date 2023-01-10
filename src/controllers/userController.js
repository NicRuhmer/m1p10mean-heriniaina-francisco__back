require('dotenv').config();

const excel = require("exceljs");

//==========================  IMPORTATION Model ================================
var Agentdb = require('../../model/call/agent');
var Roledb = require('../../model/call/role');
var Userdb = require('../../model/call/utilisateur');

var cUser = require('../user_management/UserController');
var cEntreprise = require('./entrepriseController');

var ContactAgentdb = require('../../model/call/contactAgent');
const { promiseImpl } = require('ejs');
const { ObjectId } = require('mongodb');

exports.findAllAgent = (cadence_id) => {

    return new promiseImpl((resolve, reject) => {
        ContactAgentdb.aggregate([
            { $match: { cadence: ObjectId("" + cadence_id) } },
            {
                $group: {
                    _id: { agent: "$agent", cadence: "$cadence" },
                }
            }
            ,
            {
                $project: { "_id": "$_id.agent", "agent": "$_id.agent", "cadence": "$_id.cadence", }
            }
        ]).exec(async (err, data) => {
            if (!err) {

                let tab = [];
                for (let i = 0; i < data.length; i += 1) {

                    const result = await Agentdb.findById(data[i]._id);
                    tab.push(result);
                }
                resolve(tab);

            } else {
                console.log(err.message);

                reject(err);
            }
        });
    });




};

exports.findAllEmploye = (entreprise_id, roleUser_) => {
    return new Promise(async (resolve, reject) => {
        Roledb.findOne({ description: roleUser_ }).then((role_) => {
            let tab = [];
            Agentdb.find({ entreprise: entreprise_id })
                .populate({
                    path: "user"
                }).exec((err, data) => {
                    if (err) {
                        reject({ status: 500, message: err.message });
                    } else {

                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i += 1) {
                                if (JSON.stringify(data[i].user.role) == JSON.stringify(role_._id)) {
                                    tab.push(data[i]);
                                }
                            }
                        }
                        resolve(tab);
                    }
                });
        });

    });
};


exports.findAll = () => {
    return new Promise((resolve, reject) => {
        Agentdb.find().then(repertoir => {
            resolve(repertoir)
        })
            .catch(err => {
                reject({ status: 500, message: err.message });
            });
    });
};

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Agentdb.findById(id)
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


exports.create = (id_entreprise, id_user, parameter) => {

    return new Promise((resolve, reject) => {
        var tmp = "" + parameter.phone_number;

        const new_ = {
            name: parameter.name,
            email: parameter.mail,
            title: parameter.title,
            phone_number: tmp.replace(/\s/g, ''),
            linkedin: parameter.linkedin,
            user: id_user,
            entreprise: id_entreprise
        };

        const newAgent = new Agentdb(new_);
        newAgent.save((err, docs) => {
            if (err) {
                reject({ status: 400, message: err.message });
            } else {
                resolve({ status: 200, data: docs, message: "Success !" });
            }
        });
    });
};


exports.downloadExcel = (req, res) => {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "liste des agents.xlsx"
    );

    worksheet.columns = [
        { header: "Name", key: "name", width: 5 },
        { header: "Title", key: "title", width: 25 },
        { header: "Email Adress", key: "email", width: 25 },
        { header: "Phone", key: "phone", width: 10 },
        { header: "Linkedin URL", key: "linkedin", width: 10 },
    ];
    // Agentdb.find({ entreprise: req.query.id })
    Agentdb.find().then((lists) => {
        let tab = [];
        for (var id = 0; id < lists.length; id++) {
            tab.push({
                name: lists[id].name,
                title: lists[id].title,
                email: lists[id].email,
                phone: lists[id].phone_number,
                linkedin: lists[id].linkedin,
            });
        }


    });
    worksheet.addRows([{
        name: lists[0].name,
        title: lists[0].title,
        email: lists[0].email,
        phone: lists[0].phone_number,
        linkedin: lists[0].linkedin,
    }]);
    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });

};

exports.importExcel = async (entreprise_id, XLSX, fs, files, res) => {

    var $this = this;
    const etp = await cEntreprise.findById(entreprise_id);

    var file = files.import_excel;
    var filename = 'directory-agent' + Date.now() + '_' + file.name;
    var path_ = './assets/uploads/' + filename;

    file.mv('./assets/uploads//' + filename, function (err) {
        if (err) {
            // reject({status:404,message:err.message});
            res.redirect('/');
        } else {
            if (!fs.existsSync(filename)) {

                var workbook = XLSX.readFile(path_);
                var sheet_name_list = workbook.SheetNames;
                var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

                const workbookHeaders = XLSX.readFile(path_, { sheetRows: 1 });
                const en_tete_file = XLSX.utils.sheet_to_json(workbookHeaders.Sheets[sheet_name_list[0]], { header: 1 })[0];


                if (en_tete_file[0].toUpperCase() == "FULL NAME" && en_tete_file[1].toUpperCase() == "TITLE" && en_tete_file[2].toUpperCase() == "PHONE"
                    && en_tete_file[3].toUpperCase() == "EMAIL ADRESS" && en_tete_file[4].toUpperCase() == "LINKEDIN URL") {

                    for (var i = 0; i < xlData.length; i++) {
                        var tmp_phone = "" + xlData[i][en_tete_file[2]];
                        const parameter = {
                            name: xlData[i][en_tete_file[0]],
                            title: xlData[i][en_tete_file[1]],
                            phone_number: tmp_phone.replace(/\s/g, ''),
                            mail: xlData[i][en_tete_file[3]],
                            linkedin: xlData[i][en_tete_file[4]]
                        };

                        Agentdb.findOne({ email: parameter.mail, entreprise: etp._id })
                            .then((exists) => {
                                console.log(exists);
                                if (!exists) {

                                    Userdb.findOne({ username: parameter.mail })
                                        .then((vl) => {
                                            if (!vl) {
                                                cUser.create(parameter.mail, etp.password_default, "isAgent")
                                                    .then((user) => {
                                                        $this.create(entreprise_id, user._id, parameter);
                                                    });
                                            }
                                        });
                                }
                            });
                    } // end for  

                    // res.redirect("/");
                } else {
                    var err_ = "l'une des en tête de votre colonne n'a pas suivi les indications données!";
                    res.redirect('/');
                }
                fs.rmSync(path_, { force: true, });

            } // end !fs.existsSync(filename)
            var success_ = "attribution de " + xlData.length + " agents sont terminé!";
            res.redirect('/');
            // resolve({status:400,message:success_});
        }
    });

};

exports.update_admin = (req, res) => {
    var $this = this;
    const id_agent = req.params.id;
    var tmp_phone = "" + req.body.phone_number;
    const parameter = {
        name: req.body.name,
        email: req.body.email,
        phone_number: tmp_phone.replace(/\s/g, ''),
        linkedin: req.body.linkedin,
        title: req.body.title
    };
    $this.update(id_agent, parameter).then((result) => {
        cUser.update(result.data.user, parameter.email).then((val) => {
            res.send(val);
        }).catch((err) => {
            res.send({ status: 404, message: err.message });
        });

    })
};


exports.update_agent = (req, res) => {
    var $this = this;
    var tmp_phone = "" + req.body.phone_number;
    const id_agent = req.params.id;
    const parameter = {
        name: req.body.name,
        email: req.body.email,
        phone_number: tmp_phone.replace(/\s/g, ''),
        linkedin: req.body.linkedin,
        title: req.body.title
    };
    $this.update(id_agent, parameter).then((result) => {
        cUser.update(result.data.user, parameter.email).then((val) => {
            res.send(val);
        }).catch((err) => {
            res.send({ status: 404, message: err.message });
        });

    })
};


exports.saveAdm = (req, res) => {
    var $this = this;
    res.setHeader('Content-Type', 'application/json');
    var tmp_phone = "" + req.body.phone_number;
    var tmp = tmp_phone.split('+').join('');
    const para = {
        name: req.body.name, title: req.body.title, phone_number: tmp.replace(/\s/g, ''),
        mail: req.body.mail, linkedin: req.body.linkedin, entreprise: req.body.id_etp, password: req.body.password
    };

    if (para.name != "" && para.title != "" && para.phone_number != "" || para.mail != "" && para.id_etp != "") {

        Userdb.find({ username: para.mail }).then(result => {

            if (result.length > 0) {
                res.send({ status: 404, message: "E-mail est déjà approprié à un autre agent" });
            } else {
                Agentdb.find({ $or: [{ 'email': para.mail }, { 'phone_number': para.phone_number }] }).then((val) => {
                    if (val.length <= 0) {

                        cUser.create(para.mail, para.password, "isAdmin")
                            .then((user) => {
                                $this.create(para.entreprise, user._id, para)
                                    .then((data) => {
                                        res.send(data);
                                    }).catch((err) => {
                                        console.log(err.message);
                                        res.send(err);
                                    });
                            });
                    } else {
                        res.send({ status: 404, message: "E-mail où le numéro est déjà approprié à un autre agent" });
                    }
                })
            }
        });


    } else {
        res.send({ status: 400, message: "Les données ne sont pas incorrecte" });
    }
};

exports.save_new_agent = async (req, res) => {
    var $this = this;
    res.setHeader('Content-Type', 'application/json');

    var tmp_phone = "" + req.body.phone_number;
    var tmp = tmp_phone.split('+').join('');
    const para = {
        name: req.body.name, title: req.body.title, phone_number: tmp.replace(/\s/g, ''),
        mail: req.body.mail, linkedin: req.body.linkedin, entreprise: req.body.id_etp, password: req.body.password
    };

    if (para.name != "" && para.title != "" && para.phone_number != "" || para.mail != "" && para.id_etp != "") {

        Userdb.find({ username: para.mail }).then(result => {

            if (result.length > 0) {
                res.send({ status: 404, message: "E-mail est déjà approprié à un autre agent" });
            } else {
                Agentdb.find({ $or: [{ 'email': para.mail }, { 'phone_number': para.phone_number }] }).then((val) => {
                    if (val.length <= 0) {

                        cUser.create(para.mail, para.password, "isAgent")
                            .then((user) => {

                                $this.create(para.entreprise, user._id, para)
                                    .then((data) => {
                                        res.send(data);
                                    }).catch((err) => {
                                        console.log(err.message);
                                        res.send({ status: 404, message: err.message });
                                    });
                            });
                    } else {
                        res.send({ status: 404, message: "E-mail où le numéro est déjà approprié à un autre agent" });
                    }
                })
            }
        });
    }
};


exports.update = (id, parameter) => {
    return new Promise((resolve, reject) => {
        var tmp_phone = "" + parameter.phone_number;
        var tmp = tmp_phone.split('+').join('');
        const dataUpdated = {
            name: parameter.name,
            email: parameter.email,
            phone_number: tmp.replace(/\s/g, ''),
            linkedin: parameter.linkedin,
            title: parameter.title
        };
        Agentdb.findByIdAndUpdate(id, dataUpdated, { upsert: true }, function (err, doc) {
            if (err) {
                reject({ status: 404, message: "La modification du contact avec l'" + id + "a été échoué!" });
            } else {
                resolve({ status: 200, data: doc, message: 'contact modifié avec success!' });
            }
        });
    });
};

exports.getAttributeRole = (id, id_user) => {
    const dataUpdated = { user: id_user };

    Agentdb.findByIdAndUpdate(id, dataUpdated, { upsert: true }, function (err, doc) {
        if (err) {
            reject({ status: 404, message: "La modification du contact avec l'" + id + "a été échoué!" });
        } else {
            resolve({ status: 200, message: 'role attribué' });
        }
    });
};

exports.delete = async (id) => {
    return new Promise((resolve, reject) => {
        Agentdb.findByIdAndDelete(id)
            .then(data => {
                if (data) {
                    resolve({ status: 200, message: "Le contact a été bien supprimé" });
                } else {
                    reject({ status: 400, message: "La suppression a échoué!" });
                }
            })
            .catch(err => {
                reject({ status: 500, message: err.message });
            });
    });
};

exports.delete_admin = async (req, res) => {
    var $this = this;
    const agnt = await $this.findById(req.params.id);
    await ContactAgentdb.deleteMany({ agent: req.params.id });
    $this.delete(req.params.id).then((resl) => {
        cUser.delete(agnt.user).then((result) => {
            res.send(result);
        }).catch((err) => {
            res.send({ status: 404, message: err.message });
        });
    });
};

exports.delete_agent = async (req, res) => {
    var $this = this;
    const agnt = await $this.findById(req.params.id);
    await ContactAgentdb.deleteMany({ agent: req.params.id });
    $this.delete(req.params.id).then((resl) => {
        cUser.delete(agnt.user).then((result) => {
            res.send(result);
        }).catch((err) => {
            res.send({ status: 404, message: err.message });
        });
    });
};