import mongoose from "mongoose"

const vendorSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        unique:[true,"The name is already in use"],
        trim: true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email is already in use"],
        match:[/^\S+@\S+\.\S+$/,"Provide valid Email"]
    },
    description:{
        type:String,
        // required:true,
        maxLength:150,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    profilePic: {
      type:String,
      default:""
    },
    phone:{
        type:String,
        // required:[true,"Number is required"],
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
        },
    location:{
            type:String,
            // required:true,
            default:""
        },
    role:{
            type:String,
            default:"vendor",
        },
    foodItems:[{
            type:mongoose.Schema.Types.ObjectId,ref:"Food"
        }],
    Services:
      [{type:mongoose.Schema.Types.ObjectId,ref:"Services"}]        
},{
    timestamps:true
})

const Vendor = mongoose.model("Vendor",vendorSchema)

export default Vendor