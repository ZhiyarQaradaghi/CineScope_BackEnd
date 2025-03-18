const express = require("express");
const router = express.Router();
const {
  getPopularTVShows,
  getTopRatedTVShows,
  getOnAirTVShows,
  searchTVShows,
  getTVShowDetails,
  getTVShowSeason,
  getGenres,
} = require("../controllers/tvController");

router.get("/popular", getPopularTVShows);
router.get("/top-rated", getTopRatedTVShows);
router.get("/on-the-air", getOnAirTVShows);
router.get("/:id", getTVShowDetails);
router.get("/:id/season/:seasonNumber", getTVShowSeason);

module.exports = router;
