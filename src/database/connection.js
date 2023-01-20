const mongoose = require("mongoose"); 

const uri = "mongodb+srv://garage:garage@garage.iila7sc.mongodb.net/?retryWrites=true&w=majority";
const uriLocal="mongodb://localhost:27017/garage";

const connectDB = async() => {
    try{
            await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch(err => {
            console.error('Error connecting to mongo', err);
        });
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB