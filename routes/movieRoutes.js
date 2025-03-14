const express = require("express");
const router = express.Router();
const {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
} = require("../controllers/movieController");

router.get("/popular", getPopularMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/upcoming", getUpcomingMovies);
router.get("/search", searchMovies);
router.get("/genres", getGenres);
router.get("/:id", getMovieDetails);

module.exports = router;
