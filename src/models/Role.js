const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var RoleSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    }
});


RoleSchema.set('timestamps', true); // ajout created_at et upated_at

const Roledb = mongoose.model('roles',RoleSchema);
module.exports = Roledb;
