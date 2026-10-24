import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import bookingRoutes from './routes/bookings.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'IMovies API' }));
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const port = process.env.PORT || 5000;
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI. Copy .env.example to .env and configure it.');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`IMovies API running at http://localhost:${port}`)))
  .catch((err) => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
