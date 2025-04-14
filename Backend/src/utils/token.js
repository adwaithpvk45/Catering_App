import jwt from "jsonwebtoken"

export const generateToken =  (userId,userRole,res)=>{
  try {
    const token =  jwt.sign({id:userId,role:userRole},process.env.JWT_SECRET,{expiresIn:"7d"})
    res.cookie(
        "jwt",token,{
            maxAge:7 * 24 * 60 * 60 * 1000,
            httpOnly:true,
            // secure:process.env.NODE_ENV !=="development",
            sameSite:"strict"
        }
    )

    return token
  } catch (error) {
    console.error("Error in creating token",error)
  }

}