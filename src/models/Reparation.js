const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var ReparationSchema = new mongoose.Schema({
    voiture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'voitures',
        require:true
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'clients',
        require:true
    },
    employe:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'employes'
    },
    status:{
        type: Boolean,
        default:false
    }
});


ReparationSchema.set('timestamps', true); // ajout created_at et upated_at
const Reparationdb = mongoose.model('reparations',ReparationSchema);
module.exports = Reparationdb;
