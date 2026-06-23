import { Schema, model, models } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: {
      type: String,
      enum: ['running', 'walking', 'cycling', 'strength', 'hiit', 'yoga'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    intensity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    activityDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Activity = models.Activity || model('Activity', activitySchema);
