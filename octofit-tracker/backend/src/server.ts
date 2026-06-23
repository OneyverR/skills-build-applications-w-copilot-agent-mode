import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = Number(process.env.PORT) || 8000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startServer(): Promise<void> {
  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected on ${mongoUri}`);

    app.listen(port, () => {
      console.log(`OctoFit backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
}

void startServer();