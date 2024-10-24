import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  // Check for JWT in cookies or authorization headers
  token =
    req.cookies.jwt ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Log the decoded token to verify its contents
    console.log("Decoded token:", decoded);

    // Check if user exists in the database
    req.user = await User.findById(decoded.userId).select("-password");

    // Log the user found in the database for verification
    console.log("Authenticated user:", req.user);

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error("Not authorized:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
