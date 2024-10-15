import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// Login user
// POST request: /login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if the user exists and the password matches
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(res, user._id); // Generate and set token

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token, // Include token in the response
        message: "Login successful",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Register user
// POST request: /register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(res, user._id); // Generate and set token

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token, // Include token in the response
        message: "Registration successful",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error occurred during registration:", error); // Log error to the console
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Logout user
// POST request: /logout
const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // حذف الكوكي
  });

  res.status(200).json({ message: "User logged out successfully" });
};



// Get current user's profile
// GET request: /profile
const profileUser = async (req, res) => {
  try {
    // Assuming you have a middleware that sets `req.user`
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    };

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update user profile
// PUT request: /profile/update
const updateUser = async (req, res) => {  
  try {
    const user = await User.findById(req.user._id); // Fetch user by ID

    if (user) {
      // Update user's data based on provided fields
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password; // You may want to hash the password here
      }

      const updatedUser = await user.save(); // Save updated user data

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        message: "Profile updated successfully",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error occurred while updating user profile:", error); // Log error to the console
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export { login, register, logout, profileUser, updateUser };
