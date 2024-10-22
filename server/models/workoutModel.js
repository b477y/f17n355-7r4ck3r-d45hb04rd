import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true
    },
    exercises: [
    {
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        duration: { type: Number },
        caloriesBurned: { type: Number, required: true }, 
        }
        
    ],
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
