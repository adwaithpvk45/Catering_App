import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
import Admin from "../models/adminModel.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(201).json({ message: "unauthorized access --- token not present" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(201).json({ message: "unauthorized access --- decoding failed" });
    }

    const user = await User.findById(decoded.id).select("-password");
    const vendor = await Vendor.findById(decoded.id).select("-password");
    const admin = await Admin.findById(decoded.id).select("-password");

    if (user || vendor || admin) {
      user ? (req.user = user) : vendor ? (req.user = vendor) : (req.user = admin);
      next();
    } else {
      return res.status(401).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Internal server Error" + error);
    res.status(500).json({
      message: "Internal server error,Protected route error :" + error,
    });
  }
};
