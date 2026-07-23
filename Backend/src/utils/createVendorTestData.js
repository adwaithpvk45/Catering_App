import mongoose from "mongoose";
import Vendor from "../models/vendorModel.js";
import Service from "../models/serviceModel.js";
import Food from "../models/foodModel.js";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const run = async () => {
  try {
    const dbUri = process.env.Mongo_db || "mongodb+srv://pvkadwaith1001:HlnaFtzQzXof6ojj@feastify.dodqio8.mongodb.net/?retryWrites=true&w=majority&appName=Feastify";
    await mongoose.connect(dbUri);
    console.log("Connected to database.");

    // Find the vendor
    const vendor = await Vendor.findOne({ email: "adwaithpvk45@gmail.com" });
    if (!vendor) {
      console.error("Error: Vendor with email 'adwaithpvk45@gmail.com' not found. Please register or create this vendor first.");
      await mongoose.disconnect();
      return;
    }

    console.log(`Found vendor: ${vendor.name} (${vendor._id}). Cleaning up old test data...`);

    // Clean up old services and food items for this vendor
    await Service.deleteMany({ vendor: vendor._id });
    await Food.deleteMany({ vendor: vendor._id });

    console.log("Creating sample services...");
    // Create services
    const service1 = await Service.create({
      vendor: vendor._id,
      name: "Grand Wedding Catering Service",
      description: "A premium luxury wedding dining experience featuring authentic multi-cuisine buffet spreads, elegant live counters, and high-end dessert tables.",
      category: "Wedding",
      price: 850, // price per head
      imageUrl: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=800"],
      duration: "Full day",
      status: "Available",
    });

    const service2 = await Service.create({
      vendor: vendor._id,
      name: "Deluxe Birthday Banquet Service",
      description: "Fun, vibrant and delicious birthday food catering with custom appetizers, child-friendly snacks, mocktail bars, and custom cake options.",
      category: "Birthday",
      price: 450, // price per head
      imageUrl: ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800"],
      duration: "4 hours",
      status: "Available",
    });

    console.log("Creating sample food menu items...");
    // Create food items
    const food1 = await Food.create({
      name: "Traditional Chicken Biryani",
      description: "Aromatic basmati rice layered with succulent spiced chicken, fresh mint, and caramelized onions, slow-cooked to perfection.",
      price: "250",
      category: "Main Course",
      imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800",
      status: "Available",
      vendor: [vendor._id],
    });

    const food2 = await Food.create({
      name: "Paneer Tikka Platter",
      description: "Tandoori grilled cottage cheese cubes marinated in yogurt and chef's special spice blend, served with mint chutney.",
      price: "180",
      category: "Appetizers",
      imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
      status: "Available",
      vendor: [vendor._id],
    });

    const food3 = await Food.create({
      name: "Warm Chocolate Lava Cake",
      description: "Decadent chocolate cake with a rich molten center, served warm with vanilla ice cream.",
      price: "120",
      category: "Dessert",
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800",
      status: "Available",
      vendor: [vendor._id],
    });

    // Update vendor references
    vendor.Services = [service1._id, service2._id];
    vendor.foodItems = [food1._id, food2._id, food3._id];
    await vendor.save();

    console.log(`Successfully generated and linked 2 services and 3 food items to ${vendor.email}!`);
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating vendor test data:", error);
  }
};

run();
