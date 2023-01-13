const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var DiagnostiqueSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type: String
    },
    qte:{
        type: Number,
        default:0
    },
    pu:{
        type: Number,
        default:0
    },
    duration:{
        type: Number,
        default: 0
    },
    reparation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'reparations',
        require:true
    },
    facture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'factures'
    }
});


DiagnostiqueSchema.set('timestamps', true); // ajout created_at et upated_at
DiagnostiqueSchema.plugin(passportLocalMongoose);

const Diagnostiquedb = mongoose.model('diagnostiques',DiagnostiqueSchema);
module.exports = Diagnostiquedb;
