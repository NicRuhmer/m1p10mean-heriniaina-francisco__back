const bcrypt = require('bcrypt');
const axios = require('axios');
const moment = require('moment');
moment.suppressDeprecationWarnings = true;

var Roledb = require('../models/Role');
var Userdb = require('../models/User');
var cRole = require('../controllers/roleController');
const voitureController = requi('../controllers/VoitureController');
const clientController = requi('../controllers/ClientController');

exports.listVoiture=async(req,res)=>{
    
    const cli = await clientController.findByClient(req.user._id);

    axios.get('http://localhost:3000/list/'+cli._id+'/voiture')
    .then((result) => {

        res.render('client/list_voiture', { role: req.user.role,client_id:cli._id, moment: moment, title: 'Panel Client', voitures: result.data });
    })
    .catch(err => {
        res.send(err);
    }); 
};