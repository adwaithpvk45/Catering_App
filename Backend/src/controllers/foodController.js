import Food from "../models/foodModel.js";
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const file = req.file;
    const vendorId = req.user?._id;
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "Please fill all the details of the food item" });
    }
    if (!file) {
      console.log(foodImage);
      return res.status(400).json({ message: "Food image not included." });
    }
    const imageUrl = file.path ?? file.filename;
    const newFood = new Food({
      name,
      description,
      price,
      category,
      imageUrl,
      vendor: vendorId,
    });

    const foodadded = await newFood.save();
    console.log("Food added")
    return res.status(200).json({ message: "New Item added", foodadded });
  } catch (error) {
    console.error("Error adding food:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Internal server error" + error.message });
    }
  }
};

export const getAllFood = async (req, res) => {
  try {
    //   const vendorId = req.user._id
    const foods = await Food.find();
    res.status(200).json({ message: "All food fetched", foods });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVendorFood = async (req, res) => {
  try {
    console.log(req.params)
    const { vendorId } = req.params;
    const vendorFood = await Food.find({ vendor: vendorId });
    res.status(200).json({ message: "Fetched all data", vendorFood });
  } catch (error) {
    res.status(400).json({ message: "Error in getting vendorFood", error });
  }
};

export const deleteVendorFood = async (req, res) => {
  try {
    console.log("-----------------------------",req.params)
    const { foodId } = req.params;
    const vendorFood = await Food.findOneAndDelete({ _id:foodId });
    console.log("🚀 ~ deleteVendorFood ~ vendorFood:", vendorFood)
    res.status(200).json({ message: "Item deleted", vendorFood });
  } catch (error) {
    res.status(400).json({ message: "Error in getting vendorFood", error });
  }
};
