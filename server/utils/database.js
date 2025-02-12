const mongoose = require("mongoose");
require("dotenv").config();

exports.connection = ()=>{
      mongoose.connect(process.env.MONGODB_URL)
      .then(()=>{console.log("DB connection succesfully")})
      .catch((error)=>{
        console.error(error);
        console.log("Issue in DB connection");
        process.exit(1)
      })
}
