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
    unite:{
        type: String
    },
    qte:{
        type: Number,
        default:0
    },
     tva:{
        type: Number,
        default:20
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
     status_reparation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'statut_reparations',
        require:true
    }
});


/*
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
     status_reparation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'statut_reparations',
        require:true
    },
    facture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'factures'
    }
});
*/

DiagnostiqueSchema.set('timestamps', true); // ajout created_at et upated_at

const Diagnostiquedb = mongoose.model('diagnostiques',DiagnostiqueSchema);
module.exports = Diagnostiquedb;
