// const mongoose = require("mongoose");

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Wedding",
      "Birthday",
      "Graduation Party",
      "Housewarming",
      "Anniversary",
      "Others",
    ],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: [
    {
      type: String,
    },
  ],
  duration: {
    type: String, // Example: "3 hours", "Full day"
  },
  status: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available", // Set default status if needed
    required: true,
  },
  // // availableDates: [
  // //   {
  // //     type: Date,
  // //   },
  // ],
  // // additionalServices: [
  // //   {
  // //     type: String, // Example: "Decoration", "Photography", "DJ Music"
  // //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
