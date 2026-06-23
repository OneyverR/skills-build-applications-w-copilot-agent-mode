import express from 'express';
import mongoose from 'mongoose';
import { Activity } from './models/Activity';
import { Leaderboard } from './models/Leaderboard';
import { Team } from './models/Team';
import { User } from './models/User';
import { Workout } from './models/Workout';

const app = express();
const port = 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', baseUrl });
});

app.get('/api/users/', (_req, res) => {
  void User.find().sort({ name: 1 }).lean().then((items) => {
    res.json({ resource: 'users', count: items.length, items, baseUrl });
  }).catch((error) => {
    res.status(500).json({ error: 'Failed to fetch users', details: String(error) });
  });
});

app.get('/api/teams/', (_req, res) => {
  void Team.find().populate('members', 'name email fitnessLevel totalPoints').sort({ points: -1 }).lean().then((items) => {
    res.json({ resource: 'teams', count: items.length, items, baseUrl });
  }).catch((error) => {
    res.status(500).json({ error: 'Failed to fetch teams', details: String(error) });
  });
});

app.get('/api/activities/', (_req, res) => {
  void Activity.find().populate('user', 'name email').sort({ activityDate: -1 }).lean().then((items) => {
    res.json({ resource: 'activities', count: items.length, items, baseUrl });
  }).catch((error) => {
    res.status(500).json({ error: 'Failed to fetch activities', details: String(error) });
  });
});

app.get('/api/leaderboard/', (_req, res) => {
  void Leaderboard.findOne({ period: '2026-June' })
    .populate('entries.user', 'name email totalPoints')
    .lean()
    .then((item) => {
      res.json({ resource: 'leaderboard', item, baseUrl });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch leaderboard', details: String(error) });
    });
});

app.get('/api/workouts/', (_req, res) => {
  void Workout.find().sort({ difficulty: 1, durationMinutes: 1 }).lean().then((items) => {
    res.json({ resource: 'workouts', count: items.length, items, baseUrl });
  }).catch((error) => {
    res.status(500).json({ error: 'Failed to fetch workouts', details: String(error) });
  });
});

async function startServer(): Promise<void> {
  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected on ${mongoUri}`);
    console.log(`API base URL: ${baseUrl}`);

    app.listen(port, () => {
      console.log(`OctoFit backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

void startServer();