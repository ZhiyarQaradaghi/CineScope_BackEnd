const tvService = require("../services/tvService");

const extractTMDBParams = (query) => {
  const validParams = [
    "with_genres",
    "sort_by",
    "include_adult",
    "first_air_date_year",
  ];
  const params = {};

  validParams.forEach((param) => {
    if (query[param]) {
      params[param] = query[param];
    }
  });

  return params;
};

// @desc    Get popular TV shows
// @route   GET /api/tv/popular
// @access  Public
const getPopularTVShows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const additionalParams = extractTMDBParams(req.query);

    const data = await tvService.getPopularTVShows(page, additionalParams);

    res.json(data);
  } catch (error) {
    console.error("Error in getPopularTVShows controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch popular TV shows",
    });
  }
};

// @desc    Get top rated TV shows
// @route   GET /api/tv/top-rated
// @access  Public
const getTopRatedTVShows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const additionalParams = extractTMDBParams(req.query);

    const data = await tvService.getTopRatedTVShows(page, additionalParams);

    res.json(data);
  } catch (error) {
    console.error("Error in getTopRatedTVShows controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch top rated TV shows",
    });
  }
};

// @desc    Get on air TV shows
// @route   GET /api/tv/on-the-air
// @access  Public
const getOnAirTVShows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const additionalParams = extractTMDBParams(req.query);

    const data = await tvService.getOnAirTVShows(page, additionalParams);

    res.json(data);
  } catch (error) {
    console.error("Error in getOnAirTVShows controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch on air TV shows",
    });
  }
};

// @desc    Search TV shows
// @route   GET /api/search/tv
// @access  Public
const searchTVShows = async (req, res) => {
  try {
    const query = req.query.query;
    const page = parseInt(req.query.page) || 1;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const additionalParams = extractTMDBParams(req.query);

    const data = await tvService.searchTVShows(query, page, additionalParams);

    res.json(data);
  } catch (error) {
    console.error("Error in searchTVShows controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search TV shows",
    });
  }
};

// @desc    Get TV show details
// @route   GET /api/tv/:id
// @access  Public
const getTVShowDetails = async (req, res) => {
  try {
    const showId = req.params.id;
    const data = await tvService.getTVShowDetails(showId);

    res.json(data);
  } catch (error) {
    console.error(
      `Error in getTVShowDetails controller for ID ${req.params.id}:`,
      error
    );
    res.status(500).json({
      success: false,
      message:
        error.message ||
        `Failed to fetch details for TV show ID ${req.params.id}`,
    });
  }
};

// @desc    Get TV show season
// @route   GET /api/tv/:id/season/:seasonNumber
// @access  Public
const getTVShowSeason = async (req, res) => {
  try {
    const showId = req.params.id;
    const seasonNumber = req.params.seasonNumber;
    const data = await tvService.getTVShowSeason(showId, seasonNumber);

    res.json(data);
  } catch (error) {
    console.error(
      `Error in getTVShowSeason controller for show ID ${req.params.id}, season ${req.params.seasonNumber}:`,
      error
    );
    res.status(500).json({
      success: false,
      message:
        error.message ||
        `Failed to fetch season ${req.params.seasonNumber} for TV show ID ${req.params.id}`,
    });
  }
};

// @desc    Get TV genres
// @route   GET /api/genres/tv
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await tvService.getGenres();

    res.json({
      genres: genres,
    });
  } catch (error) {
    console.error("Error in getGenres controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch TV genres",
    });
  }
};

module.exports = {
  getPopularTVShows,
  getTopRatedTVShows,
  getOnAirTVShows,
  searchTVShows,
  getTVShowDetails,
  getTVShowSeason,
  getGenres,
};
