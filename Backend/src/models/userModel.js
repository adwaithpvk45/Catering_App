import mongoose, { Schema } from "mongoose";

const userSchmema = new mongoose.Schema({
    name:{
     type:String,
     required:[true,"Name is required"],   
     trim:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already used"],
        trim:true,
        match:[/^\S+@\S+\.\S+$/,"Provide valid Email"]
    },
    profilePic:{
        type:String,
        default:""
    },
    phone:{
        type:String,
        default:null,
    },
    address: { 
        type: String, default: null 
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    role:{
        type:String,
        default:"user"
    },
    orders:[{
        type:mongoose.Schema.Types.ObjectId, ref:"Order"
    }]
},{
    timestamps:true
}
)

const User = mongoose.model("User",userSchmema)

export default User
