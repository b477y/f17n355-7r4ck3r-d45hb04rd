import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (res, userid) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

export default generateToken;