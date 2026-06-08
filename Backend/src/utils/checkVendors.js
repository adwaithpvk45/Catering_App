import mongoose from "mongoose";
import Vendor from "../models/vendorModel.js";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const run = async () => {
  try {
    const dbUri = process.env.Mongo_db || "mongodb+srv://pvkadwaith1001:HlnaFtzQzXof6ojj@feastify.dodqio8.mongodb.net/?retryWrites=true&w=majority&appName=Feastify";
    await mongoose.connect(dbUri);

    const vendors = await Vendor.find();
    console.log(`Found ${vendors.length} vendors:`);
    vendors.forEach((v, index) => {
      console.log(`\nVendor #${index + 1}:`);
      console.log("  ID:", v._id);
      console.log("  Name:", v.name);
      console.log("  Email:", v.email);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
};

run();
