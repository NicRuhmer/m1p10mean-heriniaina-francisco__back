const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var StatutReparationSchema = new mongoose.Schema({
    identifiant:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required: true
    }
});


StatutReparationSchema.set('timestamps', true); // ajout created_at et upated_at
StatutReparationSchema.plugin(passportLocalMongoose);

const StatutReparationdb = mongoose.model('statut_reparations',StatutReparationSchema);
module.exports = StatutReparationdb;
