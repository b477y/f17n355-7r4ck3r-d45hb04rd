import e from "express";
import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
// set token
// post request
//authUser
const authUser=async(req,res)=> {
    const {email, password}=req.body

    const user=await User.findOne({email});
    //check if user exists
    if(user && (await user.comparePassword(password))){

        generateToken(res, user._id)
            res.status(201).json({
                _id: user._id, 
                name: user.name,
                 email: user.email
                }
            ) //return created user
        
        }else{
            res.status(400).json({massage: 'Invalid email or password'})
        }
    
}
//signup user
//post request/user
const registerUser=async(req,res)=> {
const {name, email, password}=req.body

const userExists=await User.findOne({email})//check if user already exists

if(userExists) return res.status(400).json({massage: 'User already exists'})//return error if user already exists

const user=await User.create({name, email, password})

if(user){

generateToken(res, user._id)
    res.status(201).json({_id: user._id, name: user.name, email: user.email}) //return created user

}else{
    res.status(400).json({massage: 'Invalid user data'})
}}
//logout user
//post request/user
const Logout=async(req,res)=> {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({massage: 'logout User success'})
}
//get current user
//get request/user
const profileUser=async(req,res)=> {

    const user={_id: req.user._id,
         name: req.user.name,
          email: req.user.email}

    res.status(200).json(user);
}
//update user
//put request/user
const updaterUser = async (req, res) => {
    const user = await User.findById(req.user._id); // Fetch user based on ID

    if (user) {
        // Update user fields if present in request body
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Update password only if it's provided in the request
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save(); // Save the updated user data

        // Send response with updated user info
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        // Send error if user not found
        res.status(400).json({ message: 'User not found' });
    }
};


export {authUser,registerUser,Logout,profileUser,updaterUser} 