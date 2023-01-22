const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var UserSchema = new mongoose.Schema({
    nicname:{
        type:String,
        required:true,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    desc:{
        type:String
    }
    ,
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'roles',
        require:true
    },
     status:{
        type:Boolean,
        default:true
    }
});


UserSchema.set('timestamps', true); // ajout created_at et upated_at
UserSchema.plugin(passportLocalMongoose);

const Userdb = mongoose.model('users',UserSchema);
module.exports = Userdb;
