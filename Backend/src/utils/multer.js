import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "./cloudinary.js";

const storage =(folder) => {
    return new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:`Catering/${folder}`,
        public_id:(req,file)=> file.originalname.split(".")[0]
    }
})}

// const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];


const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only PNG, JPG, JPEG, and GIF images are allowed!"), false); // Reject file
  }
};

const uploadProfilePic = multer({ storage: storage("profilepics"),fileFilter });
const uploadFoodImages = multer({ storage: storage("foodItems"),fileFilter });


export {uploadProfilePic,uploadFoodImages}