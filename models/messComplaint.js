const mongoose=require('mongoose');

const complaint= mongoose.Schema({
  student:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  meal: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
    required: true
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
      "Food Quality",
      "Hygiene",
      "Food Quantity",
      "Mess Timing",
      "Staff Behaviour",
      "Other"
    ],
    required:true
    },

    hostelNumber:{
      type:Number,
      required:true
    },

    status:{
      type:String,
      enum:["Pending","In Progress","Resolved","Rejected"],
      default:"Pending"
    }

},{timestamps:true});

/*  AUTO DELETE AFTER 1 MONTH */
complaint.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 } // 30 days
);

const Complaint= new mongoose.model('MessComplaint',complaint);
module.exports=Complaint;