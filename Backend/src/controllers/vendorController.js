import Vendor from "../models/vendorModel.js"

export const updateVendorProfilePic = async(req,res) =>{
    try {
            const {profilePic} = req.file.path
            const VendorId = req.user._id 
        if(!profilePic){
            return res.status(400).json({message:"No image selected"})
        }
        // const uploadResponse =  await cloudinary.uploader.upload(profilePic,{
        //     folder:"Catering/profilepics"
        //    })

        // if(!uploadResponse){
        //     return res.status(400).json({message:"Error in uploading to cloudinary"})
        // }

        // const existingVendor = await Vendor.findByIdAndUpdate(VendorId,{profile:uploadResponse.secure_url},{new:true})

        const existingVendor = await Vendor.findByIdAndUpdate(VendorId,{profile:profilePic},{new:true})

        return res.status(200).json({message:"Profile updated",existingVendor})

    } catch (error) {
        console.log("internal server error:" + error)
    return res.status(500).json({message:"Internal server error"})
    }
}

export const updateVendorProfile = async(req,res) =>{
    try {
        const {decription,phone,location} = req.body
        const vendorId = req.user._id
        
    const updatedVendor = await Vendor.findByIdAndUpdate(vendorId,{decription,phone,location},{new:true})
     return res.status(400).json({message:"The Vendor Profile is updated",updatedVendor})
        
} catch (error) {
    console.log("internal server error:" + error)
    return res.status(500).json({message:"Internal server error"})
    }
}