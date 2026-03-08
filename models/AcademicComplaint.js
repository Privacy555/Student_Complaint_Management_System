const mongoose=require('mongoose');

const complaintSchema = new mongoose.Schema({

    //student → ObjectId referencing Student collection
    student:{
        type:mongoose.Schema.Types.ObjectId,                //student = ObjectId of Student document. ref tells where to see that Object id.               
        ref:"Student",                                     //ref: "Student" tells Mongoose which collection to look into.So when you call populate(), Mongoose does something like a join.                                                      
        required:true
    },

    title:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        required:true
    },

    category:{
        type:String,
        enum:[
            "Exam",
            "Attendance",
            "Marks",
            "Teacher",
            "Assignment",
            "Other"
        ],
        required:true
    },

    department:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["Pending","In Progress","Resolved","Rejected"],
        default:"Pending"
    }

},{timestamps:true});

/*  AUTO DELETE AFTER 1 MONTH */
complaintSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 } // 30 days
);

const Complaint=new mongoose.model("AcademicComplaint",complaintSchema);
module.exports=Complaint;