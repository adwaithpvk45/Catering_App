import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Vendor from "../models/vendorModel.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const run = async () => {
  try {
    const dbUri = process.env.Mongo_db || "mongodb+srv://pvkadwaith1001:HlnaFtzQzXof6ojj@feastify.dodqio8.mongodb.net/?retryWrites=true&w=majority&appName=Feastify";
    console.log("Connecting to:", dbUri);
    await mongoose.connect(dbUri);
    console.log("Connected successfully!");

    const bookings = await Booking.find()
      .populate('user')
      .populate('vendor');
    
    console.log(`Found ${bookings.length} bookings:`);
    bookings.forEach((b, index) => {
      console.log(`\nBooking #${index + 1}:`);
      console.log("  ID:", b._id);
      console.log("  User:", b.user ? `${b.user.name} (${b.user.email})` : "Null/Empty");
      console.log("  Vendor Array:", b.vendor);
      if (b.vendor && b.vendor.length > 0) {
        b.vendor.forEach((v, vIdx) => {
          console.log(`    Vendor[${vIdx}]:`, v ? `${v.name} (${v.email})` : "Null/Empty");
        });
      }
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

run();
