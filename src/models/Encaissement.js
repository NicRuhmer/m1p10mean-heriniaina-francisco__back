const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var EncaissementSchema = new mongoose.Schema({
    montant_ouvert:{
        type:Number,
        require:true
    },
    description:{
        type:String
    },
    encaisser:{
        type:Number,
        default:0
    },
    montant_restant:{
        type: Number,
        default:0
    },
    facture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'factures',
        require:true
    }
});


EncaissementSchema.set('timestamps', true); // ajout created_at et upated_at

const Encaissementdb = mongoose.model('encaissements',EncaissementSchema);
module.exports = Encaissementdb;
