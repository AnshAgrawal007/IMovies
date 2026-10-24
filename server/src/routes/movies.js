import { Router } from 'express';
import Movie from '../models/Movie.js';
import Booking from '../models/Booking.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.search
      ? { title: { $regex: String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
      : {};
    res.json(await Movie.find(filter).sort({ title: 1 }).lean());
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    const showtimeIds = movie.showtimes.map(s => s._id);
    const bookings = await Booking.find({ showtimeId: { $in: showtimeIds }, status: 'confirmed' }).select('showtimeId seats').lean();
    const bookedSeats = {};
    for (const b of bookings) {
      const key = String(b.showtimeId);
      bookedSeats[key] ||= [];
      bookedSeats[key].push(...b.seats);
    }
    res.json({ ...movie, bookedSeats });
  } catch (e) { next(e); }
});
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Movie.create(req.body)); } catch (e) { next(e); }
});
router.patch('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json(movie);
  } catch (e) { next(e); }
});
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ message: 'Movie deleted.' });
  } catch (e) { next(e); }
});
export default router;
