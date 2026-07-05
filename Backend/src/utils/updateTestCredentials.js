import mongoose from "mongoose";
import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const run = async () => {
  try {
    const dbUri = process.env.Mongo_db || "mongodb+srv://pvkadwaith1001:HlnaFtzQzXof6ojj@feastify.dodqio8.mongodb.net/?retryWrites=true&w=majority&appName=Feastify";
    await mongoose.connect(dbUri);

    console.log("Connected to database. Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("password123", salt);

    // 1. Update Vikki's password
    const userUpdate = await User.findOneAndUpdate(
      { email: "vikki45pvk@gmail.com" },
      { password: hashPassword },
      { new: true }
    );
    if (userUpdate) {
      console.log(`Updated User Vikki: ${userUpdate.email}`);
    } else {
      console.log("User Vikki not found by email vikki45pvk@gmail.com");
    }

    // 2. Update Janak's password
    const vendorUpdate = await Vendor.findOneAndUpdate(
      { email: "Janak@gmail.com" },
      { password: hashPassword },
      { new: true }
    );
    if (vendorUpdate) {
      console.log(`Updated Vendor Janak: ${vendorUpdate.email}`);
    } else {
      console.log("Vendor Janak not found by email Janak@gmail.com");
    }

    await mongoose.disconnect();
    console.log("Done updating credentials!");
  } catch (error) {
    console.error("Error updating credentials:", error);
  }
};

run();
