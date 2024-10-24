import UserInfo from "../models/userInfo.js"; // Import the UserInfo model
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique file naming
import { uploadUserImage } from "../middleware/uploadimageMiddleware.js"; // Import image upload middleware
import sharp from "sharp"; // Import sharp for image processing
import asyncHandler from "express-async-handler"; // Import async handler for error handling

// Upload single image using middleware
const uploadUserImage1 = uploadUserImage("profileImage");

// Image processing middleware to resize the uploaded image
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`; // Generate a unique filename
  if (req.file) {
    await sharp(req.file.buffer) // Process the image
      .resize(600, 600) // Resize the image
      .toFormat("jpeg") // Convert to JPEG format
      .jpeg({ quality: 90 }) // Set quality to 90%
      .toFile(`uploads/users/${filename}`); // Save the processed image
    req.body.profileImage = filename; // Add filename to request body
  }
  next(); // Proceed to the next middleware or route handler
});

// Controller function to create user info
const createUserInfo = async (req, res) => {
  try {
    const {
      age,
      weight,
      waterGoal,
      height,
      caloriesToBurn,
      waterDrank,
      caloriesBurned,
    } = req.body;

    const userId = req.user._id; // Use the user ID from the request object

    const userInfo = await UserInfo.create({
      user: userId,
      age,
      weight,
      waterGoal,
      height,
      caloriesToBurn,
      waterDrank,
      caloriesBurned,
    });

    res.status(201).json(userInfo); // Send a response with the created user info
  } catch (error) {
    console.error("Error creating user info:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller function to get user info
const getUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({ user: req.user._id }).populate(
      "Workout"
    );

    if (!userInfo) {
      return res.status(404).json({ message: "User Info not found" });
    }

    res.status(200).json(userInfo); // Return the user info
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller function to update user info
const updateUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!userInfo) {
      return res.status(404).json({ message: "User Info not found" });
    }

    res.status(200).json(userInfo); // Return the updated user info
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller function to update water intake
const updateWaterIntake = async (req, res) => {
  const userId = req.user._id; // Access user ID from the request
  const { cups } = req.body; // Get the cups value from the request body

  try {
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: userId },
      { $inc: { waterDrank: cups } }, // Increment the waterDrank by cups
      { new: true }
    );

    if (!userInfo) {
      return res.status(404).json({ message: "User information not found." });
    }

    res
      .status(200)
      .json({ message: "Water intake updated successfully.", userInfo }); // Return success message with user info
  } catch (error) {
    console.error("Error updating water intake:", error);
    res.status(500).json({ message: "Error updating water intake.", error });
  }
};

// New function to increment water intake by 1 cup
const incrementWaterIntake = async (req, res) => {
  req.body.cups = 1; // Automatically set cups to 1 for incrementing
  return updateWaterIntake(req, res); // Call the controller function to handle the update
};

// Controller function to get water data
const getWaterData = async (req, res) => {
  const userId = req.user._id; // Access user ID from the request
  console.log("Fetching water data for user ID:", userId); // Log the user ID

  try {
    const userInfo = await UserInfo.findOne({ user: userId });

    if (!userInfo) {
      return res.status(404).json({ message: "User information not found." });
    }

    // Return waterDrank and waterGoal
    res.status(200).json({
      waterDrank: userInfo.waterDrank || 0, // Ensure it defaults to 0 if undefined
      waterGoal: userInfo.waterGoal || 0, // Ensure it defaults to 0 if undefined
    });
  } catch (error) {
    console.error("Error fetching water data:", error);
    res.status(500).json({ message: "Error fetching water data.", error });
  }
};

// Export the controller functions
export {
  createUserInfo,
  getUserInfo,
  updateUserInfo,
  uploadUserImage1 as uploadUserImage,
  resizeImage,
  updateWaterIntake,
  getWaterData,
  incrementWaterIntake, // Export the increment function
};
