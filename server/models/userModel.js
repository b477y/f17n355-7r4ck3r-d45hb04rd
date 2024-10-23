import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: String,
    passwordResetVerified: Boolean
    ,
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    password: {
      type: String,
      required: [true, "password required"],
      minLength: [6, "too short password"],
    },
    workouts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout', // Refers to the Workout model
    }
  ],
    active: {
      type: Boolean,
      default: false,
    },
    // Reference to the UserInfo model
     userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo", // Referencing the UserInfo model
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
