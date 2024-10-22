import mongoose from "mongoose";

const userInfoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: "User", // Name of the model to reference
    },
    age: {
      type: Number,
      required: [true, "age required"],
    },
    weight: {
      type: Number,
      required: [true, "weight required"],
    },
    waterGoal: {
      type: Number,
      required: [true, "waterGoal required"],
    },
    height: {
      type: Number,
      required: [true, "height required"],
    },
    caloriesToBurn: {
      type: Number,
      required: [true, "caloriesToBurn required"],
    },
    waterDrank: {
      type: Number,
      required: [true, "waterDrank required"],
    },
    profileImage: String,
  },
  { timestamps: true }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

export default UserInfo;
