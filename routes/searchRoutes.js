const express = require("express");
const router = express.Router();
const { searchTVShows } = require("../controllers/tvController");
const { searchMovies } = require("../controllers/movieController");

router.get("/tv", searchTVShows);
router.get("/movies", searchMovies);

module.exports = router;
