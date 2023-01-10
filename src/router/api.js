const express = require('express');
const route = express.Router();


const sSendController = require('../controller/sms/sendController');

/*
//route.get('/reminder',cReminder.findAll);
route.get('/reminder/:id',cReminder.findById);
route.post('/reminder',cReminder.create);
route.delete('/reminder/:id',cReminder.delete);
route.put('/reminder/:id',cReminder.update);
route.get('/reminder-search/:search',cReminder.findReminderSearch);*/

module.exports = route;