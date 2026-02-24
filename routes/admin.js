const { message } = require('prompt');
const Admin=require('./../models/adminModel');
const Student=require('./../models/studentModel');
const express=require('express');
const router=express.Router();

router.post('/login',async(req,res)=>{
    try{
        const data=req.body;
        const{email,password}=req.body;

        const user = await Admin.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials provided." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials provided." });
        }

        console.log("User logged in successfully.");
        res.send("Logged in successfully.")
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});

router.post('/create-student',async(req,res)=>{
    try{
        const data=req.body;
        const find= await Student.findOne({roll_no:data.roll_no});
        if(find){
            return res.json({message:"Data for that roll no already exists."});
        }
        const newStudent= new Student(data);
        const response= await newStudent.save();
        res.status(201).json({message:"Student created successfully."})
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
})

module.exports=router;