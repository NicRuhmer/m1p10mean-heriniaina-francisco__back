const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var DepenceSchema = new mongoose.Schema({
    description:{
        type:String,
        require:true
    },
});


DepenceSchema.set('timestamps', true); // ajout created_at et upated_at

const Depencedb = mongoose.model('depenses',DepenceSchema);
module.exports = Depencedb;
