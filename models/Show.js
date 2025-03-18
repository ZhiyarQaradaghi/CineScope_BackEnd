const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  showId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  overview: String,
  posterPath: String,
  backdropPath: String,
  firstAirDate: Date,
  voteAverage: Number,
  voteCount: Number,
  popularity: Number,
  genres: [
    {
      id: Number,
      name: String,
    },
  ],
  numberOfSeasons: Number,
  numberOfEpisodes: Number,
  tmdbData: Object, 
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
