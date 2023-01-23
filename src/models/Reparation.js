const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var ReparationSchema = new mongoose.Schema({
    voiture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'voitures',
        require:true
    },
    description:{
        type:String
    }
    ,
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
    },
     start:{
        type: Boolean,
        default:false
    },
    release_date:{
        type: Date
    },
    facture:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'factures'
    },
});


ReparationSchema.set('timestamps', true); // ajout created_at et upated_at
const Reparationdb = mongoose.model('reparations',ReparationSchema);
module.exports = Reparationdb;
