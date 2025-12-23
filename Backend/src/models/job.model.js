import mongoose from "mongoose";
import { string } from "zod";

const job_schema = new mongoose.Schema({
    title:{
        type:String,
        required:true,      
        
    },
    description:{
        type:String,
        required:true,
    },
    skills:{
        type:[String],
        required:true,
    },
    expierence:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    salary:{
        min:{type:String, required:true},
        max:{type:String, required:true},
        currency:{type:String, required:true,default:"INR "},
        period:{type:String,enum:["MONTHLY","YEARLY"],default:"MONTHLY"},
    },
    recruiter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["OPEN","CLOSED"],
    default:"OPEN"} },{timestamps:true}
);

export const Job_model=mongoose.model("Job",job_schema);