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
    status:{
        type:Boolean,
        default:false
    }
});


FactureSchema.set('timestamps', true); // ajout created_at et upated_at

const Facturedb = mongoose.model('factures',FactureSchema);
module.exports = Facturedb;
