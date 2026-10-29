import mongoose from "mongoose";
import Vendor from "../models/vendorModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../../Backend/.env") });

const defaultHubs = [
  { city: "Kochi", lat: 9.9312, lng: 76.2673 },
  { city: "Kakkanad, Kochi", lat: 10.0159, lng: 76.3419 },
  { city: "Edappally, Kochi", lat: 10.0236, lng: 76.3116 },
  { city: "Calicut (Kozhikode)", lat: 11.2588, lng: 75.7804 },
  { city: "Trivandrum", lat: 8.5241, lng: 76.9366 },
  { city: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { city: "Kannur", lat: 11.8745, lng: 75.3704 },
  { city: "Aluva", lat: 10.1076, lng: 76.3516 }
];

export const seedVendorCoordinates = async () => {
  try {
    const dbUri = process.env.Mongo_db || "mongodb+srv://pvkadwaith1001:HlnaFtzQzXof6ojj@feastify.dodqio8.mongodb.net/?retryWrites=true&w=majority&appName=Feastify";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbUri);
    }

    const vendors = await Vendor.find({});
    console.log(`Checking coordinates for ${vendors.length} vendors...`);

    let updatedCount = 0;
    for (let i = 0; i < vendors.length; i++) {
      const v = vendors[i];
      // If coordinates are missing or 0,0
      if (!v.coordinates || (!v.coordinates.lat && !v.coordinates.lng)) {
        const hub = defaultHubs[i % defaultHubs.length];
        // Add small jitter so multiple vendors don't sit on the exact same micro-coordinate
        const jitterLat = (Math.random() - 0.5) * 0.03;
        const jitterLng = (Math.random() - 0.5) * 0.03;

        v.coordinates = {
          lat: parseFloat((hub.lat + jitterLat).toFixed(6)),
          lng: parseFloat((hub.lng + jitterLng).toFixed(6))
        };
        if (!v.location) {
          v.location = hub.city;
        }
        await v.save();
        updatedCount++;
      }
    }

    console.log(`Updated coordinates for ${updatedCount} vendors.`);
  } catch (error) {
    console.error("Error updating vendor coordinates:", error);
  }
};

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedVendorCoordinates().then(() => {
    mongoose.disconnect();
  });
}
