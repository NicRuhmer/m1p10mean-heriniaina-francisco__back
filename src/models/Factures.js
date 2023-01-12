const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var FactureSchema = new mongoose.Schema({
    due_date:{
        type:Date,
        require:true
    },
    invoice_date:{
        type:Date
    },
    num_facture:{
        type:String,
        required:true,
        unique:true
    },
    montant:{
        type: Number,
        default:0
    },
    reparation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'reparations',
        require:true
    },
    voiture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'voitures'
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'clients'
    },
    statut:{
        type:Boolean,
        default:false
    }
});


FactureSchema.set('timestamps', true); // ajout created_at et upated_at
FactureSchema.plugin(passportLocalMongoose);

const Facturedb = mongoose.model('factures',FactureSchema);
module.exports = Facturedb;
