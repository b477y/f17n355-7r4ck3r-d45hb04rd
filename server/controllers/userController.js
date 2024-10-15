import User from "../models/userModel.js";
import UserInfo from "../models/userInfo.js";
import generateToken from "../utils/generateToken.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const token = generateToken(res, user._id);
      res.status(200).json({ _id: user._id, name: user.name, email: user.email, token, message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    const userInfo = await UserInfo.create({ user: user._id, age, weight, waterGoal, height, caloriesToBurn, waterDrank });
    
    const token = generateToken(res, user._id);

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token, message: "Registration successful" });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "User logged out successfully" });
};

const profileUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user._id).populate("userInfo");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.status(200).json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error occurred while updating user profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export { login, register, logout, profileUser, updateUser };
