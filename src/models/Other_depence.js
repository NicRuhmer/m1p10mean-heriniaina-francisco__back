const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var OtherDepenceSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
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
    }
});


OtherDepenceSchema.set('timestamps', true); // ajout created_at et upated_at
OtherDepenceSchema.plugin(passportLocalMongoose);

const OtherDepencedb = mongoose.model('other_depences',OtherDepenceSchema);
module.exports = OtherDepencedb;
