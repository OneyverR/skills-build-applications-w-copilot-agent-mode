import mongoose from 'mongoose';
import { Activity } from '../models/Activity';
import { Leaderboard } from '../models/Leaderboard';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Workout } from '../models/Workout';

const mongoUri = 'mongodb://127.0.0.1:27017/octofit_db';

async function seed(): Promise<void> {
  try {
    await mongoose.connect(mongoUri);
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Liam Carter',
        email: 'liam.carter@mergingtonhs.edu',
        age: 16,
        gradeLevel: '10th',
        fitnessLevel: 'intermediate',
        totalPoints: 320,
      },
      {
        name: 'Maya Patel',
        email: 'maya.patel@mergingtonhs.edu',
        age: 17,
        gradeLevel: '11th',
        fitnessLevel: 'advanced',
        totalPoints: 420,
      },
      {
        name: 'Noah Kim',
        email: 'noah.kim@mergingtonhs.edu',
        age: 15,
        gradeLevel: '9th',
        fitnessLevel: 'beginner',
        totalPoints: 180,
      },
      {
        name: 'Sofia Ramirez',
        email: 'sofia.ramirez@mergingtonhs.edu',
        age: 16,
        gradeLevel: '10th',
        fitnessLevel: 'intermediate',
        totalPoints: 290,
      },
    ]);

    const [liam, maya, noah, sofia] = users;

    await Team.insertMany([
      {
        name: 'Cardio Sharks',
        coachName: 'Paul Octo',
        members: [liam._id, maya._id],
        points: 740,
      },
      {
        name: 'Strength Squad',
        coachName: 'Paul Octo',
        members: [noah._id, sofia._id],
        points: 470,
      },
    ]);

    await Activity.insertMany([
      {
        user: liam._id,
        activityType: 'running',
        durationMinutes: 35,
        caloriesBurned: 330,
        distanceKm: 5.2,
        intensity: 'high',
        activityDate: new Date('2026-06-18T16:00:00.000Z'),
      },
      {
        user: maya._id,
        activityType: 'cycling',
        durationMinutes: 40,
        caloriesBurned: 360,
        distanceKm: 12.5,
        intensity: 'high',
        activityDate: new Date('2026-06-19T16:30:00.000Z'),
      },
      {
        user: noah._id,
        activityType: 'walking',
        durationMinutes: 25,
        caloriesBurned: 120,
        distanceKm: 2.1,
        intensity: 'low',
        activityDate: new Date('2026-06-20T15:00:00.000Z'),
      },
      {
        user: sofia._id,
        activityType: 'strength',
        durationMinutes: 30,
        caloriesBurned: 240,
        intensity: 'medium',
        activityDate: new Date('2026-06-20T17:15:00.000Z'),
      },
    ]);

    await Leaderboard.create({
      period: '2026-June',
      entries: [
        { user: maya._id, points: 420, rank: 1 },
        { user: liam._id, points: 320, rank: 2 },
        { user: sofia._id, points: 290, rank: 3 },
        { user: noah._id, points: 180, rank: 4 },
      ],
    });

    await Workout.insertMany([
      {
        title: 'Campus Cardio Blast',
        category: 'cardio',
        difficulty: 'intermediate',
        targetFitnessLevel: 'intermediate',
        durationMinutes: 30,
        exercises: [
          { name: 'Jump Rope', durationSeconds: 180 },
          { name: 'Shuttle Runs', durationSeconds: 240 },
          { name: 'High Knees', durationSeconds: 120 },
        ],
      },
      {
        title: 'Beginner Strength Basics',
        category: 'strength',
        difficulty: 'beginner',
        targetFitnessLevel: 'beginner',
        durationMinutes: 25,
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: 12 },
          { name: 'Wall Push-Ups', sets: 3, reps: 10 },
          { name: 'Plank Hold', durationSeconds: 45 },
        ],
      },
      {
        title: 'Advanced HIIT Challenge',
        category: 'hiit',
        difficulty: 'advanced',
        targetFitnessLevel: 'advanced',
        durationMinutes: 20,
        exercises: [
          { name: 'Burpees', sets: 4, reps: 12 },
          { name: 'Mountain Climbers', durationSeconds: 180 },
          { name: 'Jump Lunges', sets: 3, reps: 16 },
        ],
      },
    ]);

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seed();
