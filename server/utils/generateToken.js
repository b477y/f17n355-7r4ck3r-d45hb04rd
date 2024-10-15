import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (res, userId) => {
  // Generate the token using JWT
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: '7d', // Token will be valid for 7 days
  });

  // Set the token in a cookie (HTTP-only and secure)
  res.cookie('jwt', token, {
    httpOnly: true,  // Prevent JavaScript access to the cookie
    sameSite: 'strict',  // Cookie is only sent with requests originating from the same site
    secure: process.env.NODE_ENV !== 'development',  // Use HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000,  // Set the expiration time for 7 days
  });

  // Optionally, you can return the token in the response body in case the frontend needs it
  return token;
};

export default generateToken;
