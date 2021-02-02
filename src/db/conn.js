const mongoose = require("mongoose");


// CONNECT MONGOOSE TO LOCAL SERVER

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/user-registration",
 {useNewUrlParser:true ,
  useUnifiedTopology:true,
  useCreateIndex:true,
  useFindAndModify:true,
  useFindAndModify:false})
  .then( () =>{
      console.log("Database is Conneted Succesfully...... ");
  }).catch( (err) =>{
      console.log(err);
});

