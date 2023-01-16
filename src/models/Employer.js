const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// contact
var EmployerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
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
    },
    salaire:{
        type: Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        require:true
    }
});


EmployerSchema.set('timestamps', true); // ajout created_at et upated_at

const Employerdb = mongoose.model('employes',EmployerSchema);
module.exports = Employerdb;
