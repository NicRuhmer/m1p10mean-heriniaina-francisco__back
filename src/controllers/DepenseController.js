const moment = require('moment');
moment.suppressDeprecationWarnings = true;

var Depensedb = require('../models/Depense');
var OtherDepensedb = require('../models/Other_depense');


exports.findAllDepenseById = (req,res) => {
    console.log(req.params);
        Depensedb.findById(req.params.id).then((result) => {
            res.send(result);
        }).catch((err) => {
            res.send({ status: 400, message: err.message });
        });
};

exports.findAllDepense = () => {
    return new Promise((resolve, reject) => {
        Depensedb.find().then((result) => {
            resolve(result);
        }).catch((err) => {
            reject({ status: 400,moment:moment, message: err.message });
        });
    });
};

exports.findAllOtherDepenseById = async (req,res) => {
    var $this = this;
    const dep = await $this.findAllDepense();
        OtherDepensedb.findById(req.params.id)
            .populate({ path: 'depense' })
            .exec((err, result) => {
                if (err) {
                    res.send({ status: 400, message: err.message });
                } else {
                    res.send({data:result,moment:moment,depenses:dep});
                }
            });
};


exports.findAllOtherDepense = () => {
    return new Promise((resolve, reject) => {
        OtherDepensedb.find()
            .populate({ path: 'depense' })
            .exec((err, result) => {
                if (err) {
                    reject({ status: 400, message: err.message });
                } else {
                    resolve(result);
                }
            });
    });
};


exports.statistiques = () => {
    return new Promise((resolve, reject) => {
        var val = null;

        OtherDepensedb.aggregate(
            [
                {
                    $group: {
                        _id: { depense: '$depense' },
                        'totale': { $sum: '$totale' }
                    }
                },
                {
                    $project:
                        { 'depense': "$_id.depense", totale: 1 }
                }, {
                    $sort: {
                        depense: 1
                    }
                }
            ]
        ).exec(async (err, result) => {
            if (err) {
                reject({ status: 400, message: err.message });
            } else {
                var tab = [];
                for (let index = 0; index < result.length; index++) {
                    const element = await Depensedb.findById(result[index].depense);
                    tab.push({ depense: element, totale: result[index].totale });
                }
                resolve(tab);
            }
        });
    });
};

exports.statistiqueFilter = (req, res) => {
    var filter = null;

    if (req.body.categorie == "DAY") {
        filter = [{ day: Number(moment(req.body.date).format('DD')) }, { month: Number(moment(req.body.date).format('MM')) }, { year: Number(moment(req.body.date).format('YYYY')) }];
    } else if (req.body.categorie == "MONTH") {
        filter = [{ month: Number(moment(req.body.date).format('MM')) }, { year: Number(moment(req.body.date).format('YYYY')) }];
    } else {
        filter = [{ year: Number(moment(req.body.date).format('YYYY')) }];
    }
    OtherDepensedb.aggregate(
        [
            {
                $lookup: {
                    from: 'depenses',
                    localField: 'depense',
                    foreignField: '_id',
                    as: 'is_depense',
                }
            },
            {
                $project:
                {
                    year: { $year: "$thedate" },
                    month: { $month: "$thedate" },
                    day: { $dayOfMonth: "$thedate" },
                    week: { $week: "$thedate" },
                    depense: '$is_depense',
                    totale: 1
                }
            },
            {
                $match: { $and: filter }
            },
            {
                $group: { _id: { depense: '$depense' }, 'totale': { $sum: '$totale' } }
            }, {
                $sort: { depense: 1 }
            }
        ]
    ).exec(async (err, result) => {
        if (err) {
            res.send({ status: 400, message: err.message });
        } else {
            /*  var tab = [];
              for (let index = 0; index < result.length; index++) {
                  const element = await Depensedb.findById(result[index].depense);
                  tab.push({ depense: element, totale: result[index].totale });
              }
              res.send(tab);*/
            res.send(result);
        }
    });
};
exports.listOtherDepenseFilter = (date, categorie) => {
    return new Promise((resolve, reject) => {
        var val = null;

        if (categorie == "DAY") {
            val = [{ day: Number(moment(date).format('D')) }, { month: Number(moment(date).format('M')) }, { year: Number(moment(date).format('YYYY')) }];
        } else if (categorie == "MONTH") {
            val = [{ month: Number(moment(date).format('M')) }, { year: Number(moment(date).format('YYYY')) }];
        } else {
            val = [{ year: Number(moment(date).format('YYYY')) }];
        }
        OtherDepensedb.aggregate(
            [
                {
                    $lookup: {
                        from: 'depenses',
                        localField: 'depense',
                        foreignField: '_id',
                        as: 'is_depense',
                    }
                },
                {
                    $project:
                    {
                        year: { $year: "$thedate" },
                        month: { $month: "$thedate" },
                        day: { $dayOfMonth: "$thedate" },
                        dayOfYear: { $dayOfYear: "$thedate" },
                        dayOfWeek: { $dayOfWeek: "$thedate" },
                        week: { $week: "$thedate" },
                        depense: '$is_depense',
                        categorie: 1,
                        thedate: 1,
                        description: 1,
                        totale: 1
                    }
                },
                {
                    $match: {
                        $and: val
                    }
                }
            ]
        ).exec((err, result) => {
            if (err) {
                reject({ status: 400, message: err.message });
            } else {
                resolve(result);
            }
        });
    });
};

exports.saveDepense = (req, res) => {
    var $this = this;
    if (req.body.description != null) {
        const new__ = new Depensedb({ description: req.body.description });
        new__.save(async (err, docs) => {
            if (err) {
                console.log(err.message);
                res.send({ status: 400, message: err.message });
            } else {
                console.log("success ");
                const depenses_ = await $this.findAllDepense();
                res.send({ status: 200, data: depenses_, message: "Success !" });
            }
        });
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};


exports.saveOtherDepense = (req, res) => {
    var $this = this;
    if (req.body.depense != null && req.body.categorie != null && req.body.totale != null) {
        const new__ = new OtherDepensedb({ depense: req.body.depense, description: req.body.description, thedate: req.body.date, categorie: req.body.categorie, totale: req.body.totale });
        new__.save(async (err, docs) => {
            if (err) {
                console.log(err.message);
                res.send({ status: 400, message: err.message });
            } else {
                const other_depenses_ = await $this.findAllOtherDepense();
                const depense = await Depensedb.findById(req.params.id);
                console.log("success ");
                res.send({ status: 200,moment:moment, depenses: depense, data: other_depenses_, message: "Success !" });
            }
        });
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};


exports.updateDepense = (req, res) => {
    var $this = this;
    if (req.body.description != null) {
        const dataUpdated = { description: req.body.description };
        Depensedb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, async function (err, doc) {
            if (err) {
                res.send({ status: 404, message: "La modification a échoué!" });
            } else {
                console.log("success ");
                const depenses_ = await $this.findAllDepense();

                res.send({ status: 200, data: depenses_, message: 'Success' });
            }
        });
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};


exports.updateOtherDepense = (req, res) => {
    var $this = this;
    if (req.body.depense != null && req.body.categorie != null && req.body.totale != null) {
        const dataUpdated = { depense: req.body.depense, description: req.body.description, thedate: req.body.date, categorie: req.body.categorie, totale: req.body.totale };
        OtherDepensedb.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }, async function (err, doc) {
            if (err) {
                res.send({ status: 404, message: "La modification a échoué!" });
            } else {
                console.log("success ");
                const other_depenses_ = await $this.findAllOtherDepense();
                const depense = await Depensedb.findById(req.params.id);
                res.send({ status: 200,moment:moment, depenses: depense, data: other_depenses_, message: 'Success' });
            }
        });
    } else {
        console.log('Champs invalide !');
        res.send({ status: 400, message: "champs invalide!" })
    }
};


exports.deleteDepense = async (req, res) => {
    var $this = this;
    const depense = await Depensedb.findById(req.params.id);
    await Depensedb.findByIdAndDelete(depense._id);
    OtherDepensedb.findByIdAndDelete(depense._id).then(async (result) => {
        const depenses_ = await $this.findAllDepense();

        res.send({ status: 200, data: depenses_, message: 'Suppression terminé !' })
    }).catch((err) => {
        res.send({ status: 404, message: err.message });
    });
};

exports.deleteOtherDepense = (req, res) => {
    var $this = this;
    OtherDepensedb.findByIdAndDelete(req.params.id).then(async (result) => {
        const other_depenses_ = await $this.findAllOtherDepense();
        const depense = await Depensedb.findById(req.params.id);
        res.send({ status: 200,moment:moment, depenses: depense, data: other_depenses_, message: 'Suppression terminé !' })
    }).catch((err) => {
        res.send({ status: 404, message: err.message });
    });
};

