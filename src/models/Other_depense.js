const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var OtherDepenseSchema = new mongoose.Schema({
    depense:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'depenses',
        require:true
    },
    categorie:{
        type:String,
        require:true
    },
    thedate:{
        type: Date,
        require:true
    },
    description:{
        type: String
    },
    totale:{
        type: Number,
        default:0
    }
});


OtherDepenseSchema.set('timestamps', true); // ajout created_at et upated_at

const OtherDepensedb = mongoose.model('other_depenses',OtherDepenseSchema);
module.exports = OtherDepensedb;
