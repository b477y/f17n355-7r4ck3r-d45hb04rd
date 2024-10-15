
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
      name: {
          type: String, 
          trim: true,
          required: [true, 'name required']
      },
  
      email: {
          type: String, 
          required: [true, 'email required'],
          unique: true,
          lowercase: true
      },
  
      age: Number,
      weight: Number,
      height: Number,
      waterGoal: Number,
      waterDrank: {
        type: Number,
        default: 0
      },
      caloriesToBurn: Number,
  
  
      password: {
          type: String,
          required: [true, 'password required'],
          minLength : [6, 'too short password']
      },
      passwordChangedAt: Date,
      passwordResetCode: String,
      passwordResetExpires: String,
      passwordResetVerified: Boolean
      ,
     
  
      active: {
          type: Boolean,
          default: true
      }
    },
    { timestamps: true }
  );
  
  userSchema.pre('save', async function (next) {
      if (!this.isModified('password')) return next();
      
      this.password = await bcrypt.hash(this.password, 12);
      next();
  })
  // compare password method
  userSchema.methods.comparePassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
  }
  const User =mongoose.model("User", userSchema);

export default User;