const express = require("express");
const router = express.Router();
const {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
  discoverMovies,
  getTrendingMovies,
  getMovieStreamingSources,
  getMovieServers,
} = require("../controllers/movieController");

router.get("/popular", getPopularMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/search", searchMovies);
router.get("/genres", getGenres);
router.get("/discover", discoverMovies);
router.get("/trending", getTrendingMovies);
router.get("/:id", getMovieDetails);
router.get("/:id/streaming-sources", getMovieStreamingSources);
router.get("/:id/servers", getMovieServers);

module.exports = router;
