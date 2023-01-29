const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var VoitureSchema = new mongoose.Schema({
    description:{
        type:String
    },
    matricule:{
        type:String,
        required:true,
        unique: true
    },
    carburant:{
        type: String,
        require:true,
        unique: true
    },
    genre:{
        type: String
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'clients',
        require:true
    }
});


VoitureSchema.set('timestamps', true); // ajout created_at et upated_at

const Voituredb = mongoose.model('voitures',VoitureSchema);
module.exports = Voituredb;
