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
  getTVShowStreamingSources,
  getTVShowServers,
} = require("../controllers/tvController");

router.get("/popular", getPopularTVShows);
router.get("/top-rated", getTopRatedTVShows);
router.get("/on-the-air", getOnAirTVShows);
router.get("/:id/streaming-sources", getTVShowStreamingSources);
router.get("/:id/servers", getTVShowServers);
router.get("/:id/season/:seasonNumber", getTVShowSeason);
router.get("/:id", getTVShowDetails);

module.exports = router;
