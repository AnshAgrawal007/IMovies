import { Router } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const SEAT_PATTERN = /^[A-F](?:[1-9]|1[0-2])$/;
const seatClaimSchema = new mongoose.Schema({
  showtimeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  seat: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true, collection: 'seatclaims' });
seatClaimSchema.index({ showtimeId: 1, seat: 1 }, { unique: true });
const SeatClaim = mongoose.models.SeatClaim || mongoose.model('SeatClaim', seatClaimSchema);

router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('movie', 'title posterUrl genres').sort({ createdAt: -1 }).lean();
    res.json(bookings);
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { movieId, showtimeId } = req.body;
    const seats = [...new Set((Array.isArray(req.body.seats) ? req.body.seats : []).map(s => String(s).toUpperCase()))];
    if (!mongoose.isValidObjectId(movieId) || !mongoose.isValidObjectId(showtimeId)) {
      return res.status(400).json({ message: 'Choose a valid movie and showtime.' });
    }
    if (!seats.length || seats.length > 8 || seats.some(s => !SEAT_PATTERN.test(s))) {
      return res.status(400).json({ message: 'Select between 1 and 8 valid seats (A1–F12).' });
    }
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    const showtime = movie.showtimes.id(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found.' });
    if (new Date(showtime.startsAt) <= new Date()) return res.status(400).json({ message: 'This showtime has already started.' });

    await SeatClaim.init();
    const bookingId = new mongoose.Types.ObjectId();
    try {
      await SeatClaim.insertMany(seats.map(seat => ({ showtimeId: showtime._id, seat, bookingId })), { ordered: true });
    } catch (err) {
      await SeatClaim.deleteMany({ bookingId });
      if (err.code === 11000) return res.status(409).json({ message: 'One or more seats were just booked. Please choose different seats.' });
      throw err;
    }
    try {
      const booking = await Booking.create({
        _id: bookingId, user: req.user._id, movie: movie._id,
        showtimeId: showtime._id, startsAt: showtime.startsAt,
        screen: showtime.screen, seats, total: seats.length * showtime.price,
      });
      res.status(201).json(booking);
    } catch (err) {
      await SeatClaim.deleteMany({ bookingId });
      throw err;
    }
  } catch (e) { next(e); }
});

router.post('/:id/cancel', requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id, status: 'confirmed' });
    if (!booking) return res.status(404).json({ message: 'Active booking not found.' });
    if (new Date(booking.startsAt) <= new Date()) return res.status(400).json({ message: 'This booking can no longer be cancelled.' });
    booking.status = 'cancelled';
    await booking.save();
    await SeatClaim.deleteMany({ bookingId: booking._id });
    res.json(booking);
  } catch (e) { next(e); }
});
export default router;
