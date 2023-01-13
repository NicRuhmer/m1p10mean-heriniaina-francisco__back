const express = require('express');
const route = express.Router();


const userController = require('../controllers/userController');
const employeController = require('../controllers/employerController');
//=================== Route Super Admin ==================
route.post('/verify-mail-user', userController.verifyEmail);
route.get('/list',(req,res)=>{
    userController.teste().then((data)=>{
        res.send(data)
    })
});
route.post('/new-first-spa', (req, res) => {
    userController.saveNewSAP(req.body.nicname, req.body.username, req.body.new_password,req.body.confirm_password).then((data) => {
        res.send(data);
    }).catch((err) =>{
        res.send(err);
    })
});
route.post('/resp.create',employeController.new_resp);
route.delete('/resp.delete',employeController.delete);

/*
//route.get('/reminder',cReminder.findAll);
route.get('/reminder/:id',cReminder.findById);
route.post('/reminder',cReminder.create);
route.delete('/reminder/:id',cReminder.delete);
route.put('/reminder/:id',cReminder.update);
route.get('/reminder-search/:search',cReminder.findReminderSearch);*/

module.exports = route;