import User from "../models/userModel.js"
import Vendor from "../models/vendorModel.js"
import { generateToken } from "../utils/token.js"
import bcrypt from "bcryptjs"

export const signup = async(req,res) =>{
    try {
        const {name,email,password,role}=req.body
        if(!name||!email || !password||!role){
            return res.status(400).json({message:"Invalid credential"})
        }
        if(password<8){
            return res.status(400).json({message:"Min password length should be 8"})
        }
        const [user, vendor] = await Promise.all([ // email should only be used by 1 person per role
            User.findOne({ email }),
            Vendor.findOne({ email})
        ]);
        
        const existingUser = user || vendor;

        if(existingUser){
            console.log("here")
            if(existingUser===user){
                return res.status(401).json({message:"User already registered"})
            }else{
                return res.status(401).json({message:"Vendor already registered"})

            }
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        console.log("salt")

        let newUser 

        if(role==="user"){
            newUser = new User({
                name,
                email,
                password:hashPassword,
                role,
            })
        } 
        else{
            newUser = new Vendor({
                name,
                email,
                password:hashPassword,
                role,
            })
        }
        console.log("newuser")

        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()
            if(newUser.role==="user"){
                console.log("user registered")
            return res.status(200).json({message:"User registered",newUser})
            }else{
                console.log("vendor registered")
            return res.status(200).json({message:"vendor registered",newUser})
            }
            
        }else{
            res.status(400).json({message:"Invalid User"})
        }
    } catch (error) {
        console.log("Internal server error")
        res.status(500).json({message:error.message})        
    }
}


export const login = async(req,res)=>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            console.log("Inavalid credentials")
            return res.status(200).json({message:"Invalid credentials"})
        }

        if(password<8){
            console.log("Inavalid credentials")
            return res.status(200).json({message:"Invalid credentials - password"})
        }

        const [user, vendor] = await Promise.all([ // email should only be used by 1 person per role
            User.findOne({ email }),
            Vendor.findOne({ email})
        ]);
        

        const existingUser = user || vendor

        if(!existingUser){
            return  res.status(400).json({message:"Invalid Credential ( email )"})
        }

        const passwordCorrect = await bcrypt.compare(password,existingUser.password)
        console.log("here")
        if(!passwordCorrect){
            return res.status(400).json({message:"Incorrect password"})
        }

        generateToken(existingUser._id,res)

        res.status(200).json({message:"Loggedin successfully",existingUser})
    } catch (error) {
        console.error({message:error})
        res.status(500).json({message:error.message})
    }
}


export const logout = async(res) =>{
    try {
        res.cookie("jwt","",{maxsAge:0})
        res.status(200).json("logged out")
    } catch (error) {
      res.status(500).json("internal server error:" + error)
    }
}

export const checkAuth = async ( req,res) =>{
    try {
        const user = req.user
        return res.status(200).json({message:"Authorised",user})
    } catch (error) {
        res.status(500).json("internal server error:" + error)
    }
}