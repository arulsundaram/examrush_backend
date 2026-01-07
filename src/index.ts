import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { videosRouter } from './routes/videos.js';
import { topicsRouter } from './routes/topics.js';
import { progressRouter } from './routes/progress.js';
import { achievementsRouter } from './routes/achievements.js';
import { tutorRouter } from './routes/tutor.js';
import { topicPromptRouter } from './routes/topicPrompt.js';
import { labsRouter } from './routes/labs.js';
import { examsRouter } from './routes/exams.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRouter);
app.use('/videos', videosRouter);
app.use('/videos', topicsRouter);
app.use('/progress', progressRouter);
app.use('/achievements', achievementsRouter);
app.use('/', tutorRouter);
app.use('/', topicPromptRouter);
app.use('/', labsRouter);
app.use('/exams', examsRouter);

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

