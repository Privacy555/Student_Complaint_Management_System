const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const adminSchema=mongoose.Schema({
        name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate: {
        validator: function(value) {
            return value.endsWith("@gmail.com");
        },
        message: "Email must end with gmail.com"
    }
    },
    role:{
        type:String,
        required:true,
        enum:["Admin", "Mentor", "Student"]

    },
    password:{
        type:String,
        required:true,
        select:false
    }
},{timestamps:true});

adminSchema.pre('save',async function() {
    try{
        const password=this.password;
        const salt= await bcrypt.genSalt(10);
        const hashed=await bcrypt.hash(password,salt);
        this.password=hashed;
    }catch(err){
        throw err;
    }
});


adminSchema.methods.comparePassword=async function(password){
    try{
        const isTrue= await bcrypt.compare(password,this.password);
        return isTrue;
    }catch(err){
        throw(err);
    }
    
}

const Admin=mongoose.model('Admin',adminSchema);

module.exports=Admin;