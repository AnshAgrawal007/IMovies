import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from './models/Movie.js';

const inHours = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);
const samples = [
  { title: 'The Last Horizon', overview: 'A young explorer follows a mysterious signal beyond the edge of the known world.', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w1280/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg', genres: ['Adventure', 'Sci-Fi'], durationMins: 132, rating: 8.4, language: 'English' },
  { title: 'City of Dreams', overview: 'Two strangers discover that the city they call home holds one extraordinary secret.', posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', backdropUrl: '', genres: ['Drama', 'Romance'], durationMins: 118, rating: 7.8, language: 'Hindi' },
  { title: 'Shadow Protocol', overview: 'A brilliant analyst has one night to stop a threat hidden in plain sight.', posterUrl: 'https://image.tmdb.org/t/p/w500/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg', backdropUrl: '', genres: ['Thriller', 'Action'], durationMins: 126, rating: 8.1, language: 'English' },
  { title: 'Monsoon Melody', overview: 'A musician returns home and finds inspiration in the people she left behind.', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', backdropUrl: '', genres: ['Music', 'Drama'], durationMins: 109, rating: 7.6, language: 'Hindi' },
  { title: 'Beyond the Stars', overview: 'A close-knit crew sets out to answer the universe’s oldest question.', posterUrl: 'https://image.tmdb.org/t/p/w500/5a7lMDn3nAj2ByO0X1fg6BhUphR.jpg', backdropUrl: '', genres: ['Sci-Fi', 'Adventure'], durationMins: 141, rating: 8.6, language: 'English' },
  { title: 'The Final Over', overview: 'An underdog cricket team gets one last chance to rewrite its story.', posterUrl: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', backdropUrl: '', genres: ['Sport', 'Drama'], durationMins: 124, rating: 7.9, language: 'Hindi' }
];
async function run() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in server/.env first.');
  await mongoose.connect(process.env.MONGODB_URI);
  await Movie.deleteMany({});
  await Movie.insertMany(samples.map((m, i) => ({
    ...m,
    showtimes: [
      { startsAt: inHours(5 + i), screen: 'Screen 1', price: 220 },
      { startsAt: inHours(9 + i), screen: 'Screen 2', price: 280 },
      { startsAt: inHours(30 + i), screen: 'Screen 1', price: 180 }
    ]
  })));
  console.log('Seeded 6 sample movies with showtimes.');
  await mongoose.disconnect();
}
run().catch(async e => { console.error(e); await mongoose.disconnect(); process.exit(1); });
