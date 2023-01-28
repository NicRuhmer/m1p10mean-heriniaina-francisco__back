const moment = require('moment');
moment.suppressDeprecationWarnings = true;
var OtherDepensedb = require('../models/Other_depense');

var diagnostiqueController = require('./diagnostiqueController');
var depenseController = require('./DepenseController');
var reparationController = require('./reparationController');



exports.statistiqueFilterDepense = (req, res) => {
    return new Promise((resolve, reject) => {
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
                reject({ status: 400, message: err.message });
            } else {

                resolve(result);
            }
        });
    });
};

exports.statistiqueFilter = async(req, res) => {
    var $this=this;
        const depense_ = await $this.statistiqueFilterDepense(req,res);
        const chiff_affaire_ = await reparationController.totaleChiffreAffaireFilter(req,res);
        var benefice_ = 0;
        var totaleDepense_ = 0;
        for (let index = 0; index < depense_.length; index++) {
            totaleDepense_ += depense_[index].totale;
        }
        benefice_ = (chiff_affaire_.chiffre_daffaire - totaleDepense_);
        res.send({status:200,benefice:benefice_, chiff_affaire:chiff_affaire_, depense:depense_})
};