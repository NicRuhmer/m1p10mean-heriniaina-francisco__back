const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var LoyerSchema = new mongoose.Schema({
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


LoyerSchema.set('timestamps', true); // ajout created_at et upated_at

const Loyerdb = mongoose.model('loyers',LoyerSchema);
module.exports = Loyerdb;
