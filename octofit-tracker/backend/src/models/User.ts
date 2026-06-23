import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    age: { type: Number, required: true, min: 12, max: 100 },
    gradeLevel: { type: String, required: true },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = models.User || model('User', userSchema);
