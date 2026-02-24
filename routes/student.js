const Student=require('./../models/studentModel');

const express=require('express');
const router=express.Router();

router.post('/login',async(req,res)=>{
    try{
        const data=req.body;
        const email= data.email;
        const password= data.password;

        const response= await Student.findOne({email:email}).select('+password');
        
        if(!response){
            return res.status(401).json({error:"Invalid credentials provided."});
        }
        console.log("User logged in successfully.");
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});

module.exports=router;