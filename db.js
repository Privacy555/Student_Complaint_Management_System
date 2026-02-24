const mongoose=require('mongoose');

require('dotenv').config();
const local_db=process.env.LOCALDB;
mongoose.connect(local_db);

const db=mongoose.connection;

db.on('connected',()=>{
    console.log("Database connected successfully.");
});


db.on('disconnected',()=>{
    console.log("Database disconnected successfully.");
});

db.on('error',(err)=>{
    console.log(err);
});


module.exports=db;