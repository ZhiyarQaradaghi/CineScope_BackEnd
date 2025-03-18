const express = require("express");
const router = express.Router();
const { getGenres: getTVGenres } = require("../controllers/tvController");
const { getGenres: getMovieGenres } = require("../controllers/movieController");

router.get("/tv", getTVGenres);
router.get("/movie", getMovieGenres);

module.exports = router;
