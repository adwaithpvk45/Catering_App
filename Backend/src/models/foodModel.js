import mongoose from "mongoose";

const foodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The name is required"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available", // Set default status if needed
      required: true,
    },
    vendor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
