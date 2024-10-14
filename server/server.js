import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.auth.js";

import dbConnection from "./config/db.js";
dotenv.config();


const app = express();
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", userRoutes);

dbConnection();

app.listen(port, () => {
    console.log(` app listening on port ${port}`);
});