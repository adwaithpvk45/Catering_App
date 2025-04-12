import User from "../models/userModel.js"
// import cloudinary from "../utils/cloudinary.js"

export const updateUserProfilePic = async(req,res) =>{ // for updating the profile
    try {
        const profilePic = req.file.path
        const userId = req.user._id

    if(!profilePic){
      return res.status(400).json({message:"Profile pic is required"})
    }

  //  const uploadResponse =  await cloudinary.uploader.upload(profilePic,{
  //   folder:"Catering/profilepics"
  //  })

  //  const updatedUser =await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
   const updatedUser =await User.findByIdAndUpdate(userId,{profilePic:profilePic},{new:true})
   return res.status(200).json({message:"User Profile Pic Updated",updatedUser})

  } catch (error) {
    console.log("internal server error:" + error)
    return res.status(500).json({message:"Internal server error"})
  }
}
        

export const updateUserProfile = async(req,res) =>{ // for updating the profile
    try {
        const {phone,address} = req.body
        const userId = req.user._id

    // if(!phone||!address){
    //   res.status(400).json({message:"Profile pic is required"})
    // }

//    const uploadResponse =  await cloudinary.uploader.upload(profilePic,{
//     folder:"Catering/profilepics"
//    })

   const updatedUser =await User.findByIdAndUpdate(userId,{phone,address},{new:true})

   return res.status(200).json({message:"User Profile Updated",updatedUser})

  } catch (error) {
    console.log("internal server error:" + error)
    return res.status(500).json({message:"Internal server error"})
  }
}
      