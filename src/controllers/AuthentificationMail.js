const nodemailer = require('nodemailer');



exports.sendMailSortirVehicule = (destinataire, nom_client, obj_, matricule, url_site, date_sortir) => {
    return new Promise((resolve, reject) => {
        var transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'antoenjara1998@gmail.com',
                pass: 'yzcufbqfsttpwblh'
            }
        });

        const msg = "<p>Bonjour,</p> <p>La reparation de votre vehicule sur la matricule:<span class='text-muted'>'" + matricule + "'</span> enregistré par <span class='text-muted'>" + nom_client + "</span>  est terminer le " + date_sortir + ".</p><p>Pour voir plus de detail veuillez vous se connectez sur:" + url_site+"</p>";

        var mailOption = {
            from: 'Projet-Meam-M1<antoenjara1998@gmail.com>',
            to: destinataire,
            replyTo: destinataire,
            subject: obj_,
            html: msg
        };
        transport.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log(err.message);
                reject({ status: 400, message: err.message });
            } else {
                console.log(info.response);
                resolve({ status: 200, message: 'Email envoyé !', data: info.response });
            }
        });
    });


}

exports.sendMail = (destinataire, obj_, message_) => {
    return new Promise((resolve, reject) => {
        var transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'antoenjara1998@gmail.com',
                pass: 'yzcufbqfsttpwblh'
            }
        });
        var mailOption = {
            from: 'Projet-Meam-M1<antoenjara1998@gmail.com>',
            to: destinataire,
            replyTo: destinataire,
            subject: obj_,
            html: message_
        };
        transport.sendMail(mailOption, (err, info) => {
            if (err) {
                reject({ status: 400, message: err.message });
            } else {
                resolve({ status: 200, message: 'Email envoyé !', data: info.response });
            }
        });
    });


}