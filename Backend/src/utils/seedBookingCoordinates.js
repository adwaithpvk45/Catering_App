import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../../Backend/.env") });

// Known coordinate reference points across Kerala
const locationLookup = [
  { keywords: ["kochi", "cochin", "ernakulam", "edappally"], lat: 10.0236, lng: 76.3116 },
  { keywords: ["kakkanad", "infopark"], lat: 10.0159, lng: 76.3419 },
  { keywords: ["aluva"], lat: 10.1076, lng: 76.3516 },
  { keywords: ["thrissur", "trichur"], lat: 10.5276, lng: 76.2144 },
  { keywords: ["calicut", "kozhikode"], lat: 11.2588, lng: 75.7804 },
  { keywords: ["trivandrum", "thiruvananthapuram"], lat: 8.5241, lng: 76.9366 },
  { keywords: ["kannur", "cannanore"], lat: 11.8745, lng: 75.3704 },
  { keywords: ["kollam", "quilon"], lat: 8.8932, lng: 76.6141 },
  { keywords: ["palakkad", "palghat"], lat: 10.7867, lng: 76.6548 },
  { keywords: ["kottayam"], lat: 9.5916, lng: 76.5222 }
];

export const seedBookingCoordinates = async () => {
  try {
    const dbUri = process.env.Mongo_db || "mongodb+srv://pvkadwaith1001:HlnaFtzQzXof6ojj@feastify.dodqio8.mongodb.net/?retryWrites=true&w=majority&appName=Feastify";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbUri);
    }

    const bookings = await Booking.find({});
    console.log(`Checking coordinates for ${bookings.length} bookings...`);

    let updatedCount = 0;
    for (let i = 0; i < bookings.length; i++) {
      const b = bookings[i];
      if (!b.coordinates || (!b.coordinates.lat && !b.coordinates.lng)) {
        const venueStr = (b.venueLocation || "").toLowerCase();
        let matched = locationLookup.find(loc => 
          loc.keywords.some(kw => venueStr.includes(kw))
        );

        if (!matched) {
          // Fallback to rotating among prime event hubs
          matched = locationLookup[i % locationLookup.length];
        }

        // Small random offset so points in same city form natural event clusters
        const jitterLat = (Math.random() - 0.5) * 0.04;
        const jitterLng = (Math.random() - 0.5) * 0.04;

        b.coordinates = {
          lat: parseFloat((matched.lat + jitterLat).toFixed(6)),
          lng: parseFloat((matched.lng + jitterLng).toFixed(6))
        };

        await b.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated coordinates for ${updatedCount} bookings.`);
  } catch (error) {
    console.error("Error updating booking coordinates:", error);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedBookingCoordinates().then(() => {
    mongoose.disconnect();
  });
}
