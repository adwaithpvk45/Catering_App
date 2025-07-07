import { MongoNetworkError } from "mongodb";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    role:{
        type:String,
        default:"admin"
    },
},{
    timestamps:true,
},
)

const Admin = mongoose.model("Admin",adminSchema)

export default Admin