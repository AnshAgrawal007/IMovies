import mongoose from 'mongoose';
const showtimeSchema = new mongoose.Schema({
  startsAt: { type: Date, required: true },
  screen: { type: String, default: 'Screen 1' },
  price: { type: Number, required: true, min: 1 },
}, { _id: true });
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  overview: { type: String, default: '' },
  posterUrl: { type: String, default: '' },
  backdropUrl: { type: String, default: '' },
  genres: [{ type: String }],
  durationMins: { type: Number, default: 120 },
  rating: { type: Number, default: 8.0 },
  language: { type: String, default: 'Hindi' },
  showtimes: [showtimeSchema],
}, { timestamps: true });
export default mongoose.model('Movie', movieSchema);
