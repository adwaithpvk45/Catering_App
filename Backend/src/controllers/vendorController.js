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

// export const addFood = async(req,res) =>{
//     try {
//         const {name,description,price,category} = req.body
//         const {foodImage} = req.file
//         const vendorId = req.user._id
//         if(!name||!description||!price||!category){
//             return res.status(400).json({message:"Please fill all the details of the food item"})
//         }
//         if(!foodImage){
//             return res.status(400).json({message:"Food image not included."})
//         }
//         const newFood = new Food({
//             name,
//             description,
//             price,
//             category,
//             foodImage, 
//             vendor:vendorId, 
//         })

//         const foodadded = await newFood.save()
        
//         return res.status(200).json({message:"New Item added",foodadded})
//     } catch (error) {
//         res.status(200).json({message:error.message})
//     }
// }

// export const vendorFood = async (req,res)=>{
        
// }