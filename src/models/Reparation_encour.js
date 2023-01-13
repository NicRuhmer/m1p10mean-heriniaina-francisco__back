const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var ReparationEncourSchema = new mongoose.Schema({
    diagnostique:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'diagnostiques',
        require:true
    },
    statut_reparation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'statut_reparations'
    }
});


ReparationEncourSchema.set('timestamps', true); // ajout created_at et upated_at
ReparationEncourSchema.plugin(passportLocalMongoose);

const ReparationEncourdb = mongoose.model('reparation_encours',ReparationEncourSchema);
module.exports = ReparationEncourdb;
