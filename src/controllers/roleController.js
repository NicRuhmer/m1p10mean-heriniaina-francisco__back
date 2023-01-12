var Roledb = require('../models/Role');

exports.listRoleResponsable = () => {
    return new Promise((resolve, reject) => {
        Roledb.find({
            $or: [{ role: 'isAtelied' }, { role: 'isFinancied' }]
        }).then((data) => {
            if (data) {
                resolve(data)
            } else {
                reject({ status: 400, message: 'Aucun donnée!' });
            }
        }).catch((err) => {
            reject({ status: 400, message: err.message });
        })
    });
};