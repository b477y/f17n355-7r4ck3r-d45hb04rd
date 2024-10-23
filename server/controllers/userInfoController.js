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
    console.log("Request body:", req.body); // Log the request body for debugging

    const {
      age,
      weight,
      waterGoal,
      height,
      caloriesToBurn,
      waterDrank,
      caloriesBurned,
    } = req.body;

    // Use the user ID from the request object set by the middleware
    const userId = req.user._id;

    // Create the user info record in the database
    const userInfo = await UserInfo.create({
      user: userId, // Use the userId from the middleware
      age,
      weight,
      waterGoal,
      height,
      caloriesToBurn,
      waterDrank,
      caloriesBurned,
    });

    // Send a response with the created user info
    res.status(201).json(userInfo);
  } catch (error) {
    console.error("Error creating user info:", error); // Log any errors
    res.status(500).json({ message: "Server error. Please try again later." }); // Send server error response
  }
};

// Controller function to get user info
const getUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({
      user: req.params.userId,
    }).populate("Workout"); // Populate associated workout data

    if (!userInfo) {
      return res.status(404).json({ message: "User Info not found" }); // Handle not found case
    }

    res.status(200).json(userInfo); // Send the user info
  } catch (error) {
    console.error("Error fetching user info:", error); // Log any errors
    res.status(500).json({ message: "Server error. Please try again later." }); // Send server error response
  }
};

// Controller function to update user info
const updateUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: req.params.userId }, // Find user info by user ID
      req.body, // Update with request body
      { new: true, runValidators: true } // Return the updated document
    );

    if (!userInfo) {
      return res.status(404).json({ message: "User Info not found" }); // Handle not found case
    }

    res.status(200).json(userInfo); // Send the updated user info
  } catch (error) {
    console.error("Error updating user info:", error); // Log any errors
    res.status(500).json({ message: "Server error. Please try again later." }); // Send server error response
  }
};

// Export the controller functions
export {
  createUserInfo,
  getUserInfo,
  updateUserInfo,
  uploadUserImage1 as uploadUserImage,
  resizeImage,
};
