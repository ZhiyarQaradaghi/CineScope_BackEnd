const mongoose = require('mongoose');

// we need this to cache movie data because we are using the TMDb API and it can be slow
const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: Date,
  voteAverage: Number,
  voteCount: Number,
  popularity: Number,
  genres: [
    {
      id: Number,
      name: String
    }
  ],
  runtime: Number,
  tmdbData: Object, // this will store the complete TMDb response for flexibility because we can add more fields to the response
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

movieSchema.index({ movieId: 1 });
movieSchema.index({ title: 'text' });

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;