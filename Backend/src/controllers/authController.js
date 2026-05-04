import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    if (password < 8) {
      return res
        .status(400)
        .json({ message: "Min password length should be 8" });
    }
    const [user, vendor] = await Promise.all([
      // email should only be used by 1 person per role
      User.findOne({ email }),
      Vendor.findOne({ email }),
    ]);

    const existingUser = user || vendor;

    if (existingUser) {
      console.log("here");
      if (existingUser === user) {
        return res.status(401).json({ message: "User already registered" });
      } else {
        return res.status(401).json({ message: "Vendor already registered" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    console.log("salt");

    let newUser;

    if (role === "user") {
      newUser = new User({
        name: fullName,
        email,
        password: hashPassword,
        role,
      });
    } else {
      newUser = new Vendor({
        name: fullName,
        email,
        password: hashPassword,
        role,
      });
    }
    console.log("newuser");

    if (newUser) {
      generateToken(newUser._id, newUser.role, res);
      await newUser.save();
      if (newUser.role === "user") {
        console.log("user registered");
        return res.status(200).json({ message: "User registered", newUser });
      } else {
        console.log("vendor registered");
        return res
          .status(200)
          .json({ message: "Vendor Created Successfully", newUser });
      }
    } else {
      res.status(400).json({ message: "Invalid User" });
    }
  } catch (error) {
    console.log("Internal server error");
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Inavalid credentials");
      return res.status(200).json({ message: "Invalid credentials" });
    }

    if (password < 8) {
      console.log("Inavalid credentials");
      return res
        .status(200)
        .json({ message: "Invalid credentials - password" });
    }

    const [user, vendor, admin] = await Promise.all([
      // email should only be used by 1 person per role
      User.findOne({ email }),
      Vendor.findOne({ email }),
      Admin.findOne({ email }),
    ]);

    const existingUser = user || vendor || admin;

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credential ( email )" });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    console.log("here");
    if (!passwordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    generateToken(existingUser._id, existingUser.role, res);

    res.status(200).json({ message: "Loggedin successfully", existingUser });
  } catch (error) {
    console.error({ message: error });
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out" });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ message: "Authorised", user });
  } catch (error) {
    res.status(500).json("internal server error:" + error);
  }
};

import jwt from "jsonwebtoken";
import { sendResetEmail } from "../utils/email.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const [user, vendor, admin] = await Promise.all([
      User.findOne({ email }),
      Vendor.findOne({ email }),
      Admin.findOne({ email }),
    ]);

    const existingUser = user || vendor || admin;

    if (!existingUser) {
      // Don't reveal that the user does not exist for security reasons
      return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    }

    // Generate a 15-minute token containing the user's ID and role
    const resetToken = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWt_SECRET,
      { expiresIn: "15m" }
    );

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await sendResetEmail(existingUser.email, resetUrl);

    res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWt_SECRET);
    
    // Find the user by decoded ID
    const [user, vendor, admin] = await Promise.all([
      User.findById(decoded.id),
      Vendor.findById(decoded.id),
      Admin.findById(decoded.id),
    ]);

    const existingUser = user || vendor || admin;

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    existingUser.password = hashPassword;
    await existingUser.save();

    res.status(200).json({ message: "Password has been successfully reset. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
    }
    res.status(400).json({ message: "Invalid or expired reset token" });
  }
};

