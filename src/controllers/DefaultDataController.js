var Roledb = require('../models/Role');
var StatutReparationdb = require('../models/StatutReparation');

exports.insertDefaultData = async (req, res) => {

	const role_ = await Roledb.find();
	const status_ = await StatutReparationdb.find();

	if (role_.length <= 0) {
		Roledb.insertMany([
			{
				role: "isSuperAdmin",
				description: "Super admin"
			},
			{
				role: "isAtelied",
				description: "Responsable atelier"
			},
			{
				role: "isFinancied",
				description: "Responsable financier"
			},
			{
				role: "isClient",
				description: "Client"
			}
		]).then(function (test) {
			if (test) {
				if (status_.length <= 0) {
					StatutReparationdb.insertMany([
						{
							identifiant: "isTache",
							description: "à faire"
						},
						{
							identifiant: "isEnCour",
							description: "en cours"
						},
						{
							identifiant: "isTerminer",
							description: "terminer"
						}

					]).then(function (val) {

						res.send("Donnée initialisé");

					}).catch(function (error2) {
						res.send({ status: 400, message: error2.message, collection: "Status reparation" });
					});
				}


			} // fin test

		}).catch(function (error) {
			res.send({ status: 400, message: error.message, collection: "Role Utilisateur" });      // Failure
		});
	} else {
		if (status_.length <= 0) {
			StatutReparationdb.insertMany([
				{
					identifiant: "isTache",
					description: "à faire"
				},
				{
					identifiant: "isEnCour",
					description: "en cours"
				},
				{
					identifiant: "isTerminer",
					description: "terminer"
				}

			]).then(function () {

				res.send("Donnée initialisé");

			}).catch(function (error2) {
				res.send({ status: 400, message: error2.message, collection: "Status reparation" });
			});
		} else {
			res.send("Donnée déjà initialisé ");
		}
	}


}