const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var ClientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type: String
    },
    contact:{
        type: String
    },
    adresse:{
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
     cin:{
        type: String,
        required: true,
        unique: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    }
});


ClientSchema.set('timestamps', true); // ajout created_at et upated_at
ClientSchema.plugin(passportLocalMongoose);

const Clientdb = mongoose.model('clients',ClientSchema);
module.exports = Clientdb;
