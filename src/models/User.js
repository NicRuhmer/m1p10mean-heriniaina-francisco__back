const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'c_role',
        require:true
    }
});


UserSchema.set('timestamps', true); // ajout created_at et upated_at
UserSchema.plugin(passportLocalMongoose);

const Userdb = mongoose.model('users',UserSchema);
module.exports = Userdb;
