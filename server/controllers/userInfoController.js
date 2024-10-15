import UserInfo from "../models/userInfo.js";

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
    const userInfo = await UserInfo.findOne({ user: req.params.userId });

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

export { createUserInfo, getUserInfo, updateUserInfo };
