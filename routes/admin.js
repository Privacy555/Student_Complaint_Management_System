
const Admin=require('./../models/adminModel');
const Student=require('./../models/studentModel');
const express=require('express');
const router=express.Router();

const AcademicComplaint=require('./../models/AcademicComplaint');
const messComplaint=require('./../models/messComplaint');

const {jwtAuthMiddleware,generateToken}=require('./../middleware/jwt');
const roleMiddleware=require('./../middleware/roleMiddleware');
const { message } = require('prompt');

router.post('/login',async(req,res)=>{
    try{
        
        const{email,password}=req.body;

        const user = await Admin.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials provided." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials provided." });
        }
        const payload={
            email:user.email,
            role:user.role
        }
        const token=await generateToken(payload)

        res.status(200).json({message:"Admin lpogged in successfully.",token});
        
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});

router.use(jwtAuthMiddleware);
router.use(roleMiddleware('Admin'));

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
});

//to update student's data
router.put('/update-student/:roll_no',async (req,res)=>{
    try{
        const roll_no=req.params.roll_no;
        const dataToBeUpdated=req.body;
        const response= await Student.findOneAndUpdate({roll_no},dataToBeUpdated,{
            new:true,
            runValidators:true
        });
        if(!response){
            return res.status(404).json({error:"Student with that roll number hasn't been found."});
        }
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
    res.status(200).json({message:"Data updated successfully"});
});

//delete student's data
router.delete('/delete-student/:roll_no',async (req,res)=>{
    try{
        const roll_no=req.params.roll_no;
        const response=await Student.findOneAndDelete({roll_no:roll_no});
        res.status(200).json({message:"Student has been deleted",response});
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});

router.get('/academic-complaints',async (req,res)=>{
    try{
        const response=await AcademicComplaint.find();
        if(!response){
            return res.send("No data in database to show.");
        }
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});

router.get('/mess-complaints',async (req,res)=>{
    try{
        const response=await messComplaint.find();
        if(!response){
            return res.send("No data in database to show.");
        }
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});

router.get('/mess-complaints/:statusOfIssue',async (req,res)=>{
    try{
        const statusOfIssue=req.params.statusOfIssue;
        const response=await messComplaint.find({status:statusOfIssue});
        if(!response){
            return res.status(404).json({message:"Information missing in database for that status."});
        }
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
})

router.get('/academic-complaints/:statusOfIssue',async (req,res)=>{
    try{
        const statusOfIssue=req.params.statusOfIssue;
        const response=await AcademicComplaint.find({status:statusOfIssue});
        if(!response){
            return res.status(404).json({message:"Information missing in database for that status."});
        }
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json('Internal server error.');
    }
});

module.exports=router;