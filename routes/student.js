const { message } = require('prompt');
const Student=require('./../models/studentModel');
const AcademicComplaint=require('./../models/AcademicComplaint');
const MessComplaint=require('./../models/messComplaint');

const express=require('express');
const router=express.Router();

const {jwtAuthMiddleware,generateToken}=require('./../middleware/jwt');
const roleMiddleware=require('./../middleware/roleMiddleware');

//Login
router.post('/login',async(req,res)=>{
    try{
        const {roll_no,password}=req.body;
        const user= await Student.findOne({roll_no:roll_no}).select('+password');               //if that roll no is not present, null is returned
        if(!user){
            return res.status(401).json({error:"Invalid roll number provided."});
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({error:"Incorrect password."});
        }
        const payload={
            roll_no:roll_no,
            role:user.role
        }
        const token= generateToken(payload);
        res.status(200).json({message:"User logged in successfully.",token});

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});


router.use(jwtAuthMiddleware); 
router.use(roleMiddleware("Student"));

//Read myProfile
router.get('/myProfile',async (req,res)=>{
try{
    const data=req.user;
    const dataFromDb= await Student.findOne({roll_no:data.roll_no}).select('+password');
    if(dataFromDb){
        res.status(200).json({dataFromDb});
    }else{
        return res.status(404).json({message:"Roll number not found."});
    }
    console.log("Data fetched successfully");
}catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error. "});
}
});

//update myProfile
router.put('/myProfile',async(req,res)=>{
try{
    delete req.body.role;                                                       //not letting student change role in any cost.
    const data=req.user;
    const roll_no=Number.parseInt(data.roll_no);
    const updateData=req.body;

    const response= await Student.findOneAndUpdate({roll_no},updateData,{
        new:true,
        runValidators:true
    });

    if(!response){
        return res.status(404).json({error:"Person not found."});
    }

    console.log("Data updated successfully.");
    res.status(200).json(response);
}catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error."});
}
});



//upload academic complaints
router.post('/createAcademicComplaint',async (req,res)=>{
    try{
        const { title, description, category, department } = req.body;
        // get student using roll_no from JWT
        const student = await Student.findOne({ roll_no: req.user.roll_no });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const complaint = await AcademicComplaint.create({
            student: student._id,                          //assigning the Student document’s _id to the student field of the complaint.
            title,
            description,
            category,
            department
        });

         res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error"});
    }
});



router.post('/createMessComplaint', async (req,res)=>{
    try{
        const data=req.body;
        const student=await Student.findOne({roll_no:req.user.roll_no});

        if(!student){
            return res.status(404).json({message:"Student not found."});
        }

        const complaint={
            student:student._id,
            ...data,
            hostelNumber:student.hostelNumber
        }
        const response= await MessComplaint.create(complaint);
        res.status(201).json({
            message: "Complaint submitted successfully",
            response}
        );
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Internal server error."});
    }
});


module.exports=router;

