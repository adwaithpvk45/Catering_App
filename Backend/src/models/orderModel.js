import mongoose from "mongoose"

const orderSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    vendor:{
        type:mongoose.Schema.Types.ObjectId,ref:"Vendor", required:true
    },
    footItems:[{
        food:{type:mongoose.Schema.Types.ObjectId,ref:"Food",required:true},
        quantity:{type:Number,required,default:1}
    }],
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","completed","cancelled"],
        default:"pending"   
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

const Order = mongoose.model("Order",orderSchema)

export default Order