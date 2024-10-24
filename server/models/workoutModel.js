import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //   sets: { type: Number, required: true },
  //   reps: { type: Number, required: true },
  //   duration: { type: Number, required: true }, // Duration in minutes
  caloriesBurned: { type: Number, required: true }, // Calories burned for this exercise
  completed: { type: Boolean, default: true }, // Indicates if the exercise is completed
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the User model
      required: true,
    },
    exercises: [exerciseSchema], // Embed exercise schema here
    date: { type: Date, default: Date.now },
    totalCaloriesBurned: { type: Number, default: 0 }, // Total calories burned from completed exercises
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
