import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startsAt: { type: Date, required: true },
  screen: { type: String, required: true },
  seats: [{ type: String, required: true }],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });
bookingSchema.index({ showtimeId: 1, seats: 1 });
export default mongoose.model('Booking', bookingSchema);
