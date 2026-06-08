import Vendor from "../models/vendorModel.js"

export const updateVendorProfilePic = async(req,res) =>{
    try {
        if (!req.file) {
            return res.status(400).json({message:"No image selected"})
        }
        const profilePic = req.file.path
        const VendorId = req.user._id 

        const existingVendor = await Vendor.findByIdAndUpdate(VendorId,{profilePic:profilePic},{new:true})

        return res.status(200).json({message:"Profile updated",existingVendor})

    } catch (error) {
        console.log("internal server error:" + error)
        return res.status(500).json({message:"Internal server error"})
    }
}

export const updateVendorProfile = async(req,res) =>{
    try {
        const {description,phone,location} = req.body
        const vendorId = req.user._id
        
        const updatedVendor = await Vendor.findByIdAndUpdate(vendorId,{description,phone,location},{new:true})
        return res.status(200).json({message:"The Vendor Profile is updated",updatedVendor})
        
    } catch (error) {
        console.log("internal server error:" + error)
        return res.status(500).json({message:"Internal server error"})
    }
}