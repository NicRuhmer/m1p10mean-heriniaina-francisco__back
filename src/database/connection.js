const mongoose = require("mongoose"); 

const connectDB = async() => {
    try{
        //mongodb connection string
        await mongoose.connect("mongodb://localhost:27017/garage", {
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