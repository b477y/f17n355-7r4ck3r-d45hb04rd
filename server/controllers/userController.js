import User from "../models/userModel.js";
import UserInfo from "../models/userInfo.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/nodemailer.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "express-async-handler";




const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

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
    const userExists = await User.findOne({ email: email });
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

// @desc forget password
// @route POST /forgetPassword
// @access Public

const forgetPassword = async (req, res, next) => {
    // 1- get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no user for this email ${req.body.email}`, 404))
    }
    // 2- check if user exists, generate reset random 6 number, save it in our db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hasedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    //saved hased reset code in db 
    user.passwordResetCode = hasedResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
    user.passwordResetVerified = false // not verified yet

    await user.save();

    // 3- send the reset code via email
    
    
    const message = `Hi ${user.name},\nWe received a request to reset the password on your E-shop Account. \n${resetCode} \nEnter this code to complete the reset. \nThanks for helping us keep your account secure.\nThe E-shop Team`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 min)',
            message,
        });
    } catch (err) {
        user.passwordResetCode = undefined
        user.passwordResetExpires = undefined
        user.passwordResetVerified = undefined
        await user.save();

        return next(new ApiError('Email could not be sent', 500))
    }

    res.status(200).json({status: 'Success', message: 'Reset code sent to email'})
}


// @desc verify reset password
// @route POST /verifyResetCode
// @access Public

const verifyPassResetCode = asyncHandler(async (req, res, next) => {
    // 1) get user based on  reset code
    const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
    const user = await User.findOne({ passwordResetCode: hashedResetCode, passwordResetExpires: {$gt: Date.now()} });
    if (!user) {
        return next(new ApiError(`Invalid reset code or expired`, 400))
    }

    // 2) Reset code valid
    user.passwordResetVerified = true

    await user.save();

    res.status(200).json({status: 'Success', message: 'Reset code verified'})
})

const resetPassword = async (req, res, next) => {
    // 1) get user based on email

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`there is no user with this email`, 404))
    }
    // check if reset code verified
    if (!user.passwordResetVerified) {
        return next(new ApiError(`password reset code has not been verified`, 400))
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    // 3) if everything is ok, generate token
    const token = generateToken(res, user._id);

    res.status(200).json({ data: user, token });
}

const allowedTo = (...roles) => 
    asyncHandler(async (req, res, next) => {
        //1- check user role
        if (!(roles.includes(req.user.role)))
            return next(new ApiError('You have no permission to perform this action', 403));

        next();
    })

export { login, register, logout, profileUser, updateUser, forgetPassword, verifyPassResetCode, resetPassword, allowedTo };
