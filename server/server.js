import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.auth.js";
import userInfoRoutes from './routes/userInfoRoutes.js';
import cors from "cors";
import dbConnection from "./config/db.js";
import workoutRoute from "./routes/workoutRoute.js";
import globalError from "./middleware/errormiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

dbConnection();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // This is necessary to allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", userRoutes);
app.use('/api/userinfo', userInfoRoutes);
app.use('/workout', workoutRoute);

app.use(globalError)

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
