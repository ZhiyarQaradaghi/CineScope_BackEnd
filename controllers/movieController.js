const tmdbService = require("../services/tmdbService");

const extractTMDBParams = (query) => {
  const validParams = [
    "with_genres",
    "sort_by",
    "include_adult",
    "year",
    "primary_release_year",
  ];
  const params = {};

  validParams.forEach((param) => {
    if (query[param]) {
      params[param] = query[param];
    }
  });

  return params;
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const additionalParams = extractTMDBParams(req.query);

    const data = await tmdbService.getPopularMovies(page, additionalParams);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getPopularMovies controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch popular movies",
    });
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
const getTopRatedMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const additionalParams = extractTMDBParams(req.query);

    const data = await tmdbService.getTopRatedMovies(page, additionalParams);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getTopRatedMovies controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch top rated movies",
    });
  }
};

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
// @access  Public
const getUpcomingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const additionalParams = extractTMDBParams(req.query);

    const data = await tmdbService.getUpcomingMovies(page, additionalParams);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getUpcomingMovies controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch upcoming movies",
    });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
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

    const data = await tmdbService.searchMovies(query, page, additionalParams);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in searchMovies controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search movies",
    });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res) => {
  try {
    const movieId = req.params.id;
    const data = await tmdbService.getMovieDetails(movieId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      `Error in getMovieDetails controller for ID ${req.params.id}:`,
      error
    );
    res.status(500).json({
      success: false,
      message:
        error.message ||
        `Failed to fetch details for movie ID ${req.params.id}`,
    });
  }
};

// @desc    Get movie genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();

    res.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error("Error in getGenres controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch genres",
    });
  }
};

// @desc    Discover movies by genre and other filters
// @route   GET /api/movies/discover
// @access  Public
const discoverMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const additionalParams = extractTMDBParams(req.query);

    const data = await tmdbService.discoverMovies(page, additionalParams);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in discoverMovies controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to discover movies",
    });
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const timeWindow = req.query.time_window || "week";
    const additionalParams = extractTMDBParams(req.query);

    const data = await tmdbService.getTrendingMovies(
      timeWindow,
      page,
      additionalParams
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getTrendingMovies controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch trending movies",
    });
  }
};

module.exports = {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
  discoverMovies,
  getTrendingMovies,
};
