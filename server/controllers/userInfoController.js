import UserInfo from "../models/userInfo.js";
import { v4 as uuidv4 } from 'uuid';
import { uploadUserImage } from '../middleware/uploadimageMiddleware.js'
import sharp from 'sharp';
import asyncHandler from 'express-async-handler'

// upload single image
const uploadUserImage1 = uploadUserImage("profileImage");

// image processing
const resizeImage = asyncHandler(async (req, res, next) => { 
    
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`
    if (req.file) {
        await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`uploads/users/${filename}`);
        req.body.profileImage = filename;
    }  
    next();
})


const createUserInfo = async (req, res) => {
  try {
    const { userId, age, weight, waterGoal, height, caloriesToBurn, waterDrank } = req.body;

    const userInfo = await UserInfo.create({
      user: userId,
      age,
      weight,
      waterGoal,
      height,
      caloriesToBurn,
      waterDrank,
    });

    res.status(201).json(userInfo);
  } catch (error) {
    console.error('Error creating user info:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({ user: req.params.userId }).populate('Workout');

    if (!userInfo) {
      return res.status(404).json({ message: 'User Info not found' });
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!userInfo) {
      return res.status(404).json({ message: 'User Info not found' });
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export { createUserInfo, getUserInfo, updateUserInfo, uploadUserImage, resizeImage };
