import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";

const mongoUri = "mongodb+srv://pvkadwaith1001:HlnaFtzQzXof6ojj@feastify.dodqio8.mongodb.net/?retryWrites=true&w=majority&appName=Feastify";

async function run() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    const admins = await Admin.find({});
    if (admins.length > 0) {
      console.log("FOUND_ADMINS:");
      admins.forEach(a => {
        console.log(`- Name: ${a.name}, Email: ${a.email}, Role: ${a.role}`);
      });
    } else {
      console.log("NO_ADMINS_FOUND. Creating default admin account...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin12345", salt);
      const newAdmin = new Admin({
        name: "Platform Admin",
        email: "admin@feastify.com",
        password: hashedPassword,
        role: "admin"
      });
      await newAdmin.save();
      console.log("CREATED_DEFAULT_ADMIN: email: admin@feastify.com / password: admin12345");
    }
  } catch (err) {
    console.error("Error running script:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
