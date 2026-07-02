const mongoose = require('mongoose');


function connectToDB(){

    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Server is connected to DB");
    })
    .catch(err => {
        console.err("Error connecting to db:", err.message);
        process.exit(1);
    })
}


module.exports = connectToDB;