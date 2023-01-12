const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var PieceSchema = new mongoose.Schema({
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


PieceSchema.set('timestamps', true); // ajout created_at et upated_at
PieceSchema.plugin(passportLocalMongoose);

const Piecedb = mongoose.model('pieces',PieceSchema);
module.exports = Piecedb;
