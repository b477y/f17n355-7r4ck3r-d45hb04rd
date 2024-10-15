import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protact = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res
      .status(401)
      .send({ error: "Not authorized to access this resource, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(404).send({ error: "User not found" });
    }

    next(); // Proceed to the next middleware or controller
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    return res.status(401).send({ error: "Not authorized, token failed" });
  }
};


export { protact };
