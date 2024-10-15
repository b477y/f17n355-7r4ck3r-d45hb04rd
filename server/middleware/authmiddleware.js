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

<<<<<<< HEAD
    req.user = await User.findById(decoded.userid).select("-password");

    next(); // Call the next middleware or controller
=======
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(404).send({ error: "User not found" });
    }

    next(); // Proceed to the next middleware or controller
>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    return res.status(401).send({ error: "Not authorized, token failed" });
  }
};

<<<<<<< HEAD
=======

>>>>>>> 84b5a4ea1303b242e9d79b0fd76684373fd36765
export { protact };
