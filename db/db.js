const mongoose = require("mongoose")

function connectDB(){
    const connection = mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return connection;
}

module.exports = connectDB;