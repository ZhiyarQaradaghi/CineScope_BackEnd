const User = require("../models/User");
const tmdbService = require("../services/tmdbService");

// @desc    Get user's favorite movies
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const favoriteDetails = await Promise.all(
      user.favorites.map(async (fav) => {
        try {
          const movieDetails = await tmdbService.getMovieDetails(fav.movieId);
          return {
            ...movieDetails,
            addedAt: fav.addedAt,
          };
        } catch (error) {
          console.error(
            `Error fetching details for movie ID ${fav.movieId}:`,
            error
          );
          return {
            movieId: fav.movieId,
            addedAt: fav.addedAt,
            error: "Failed to fetch movie details",
          };
        }
      })
    );

    res.json({
      success: true,
      data: favoriteDetails,
    });
  } catch (error) {
    console.error("Error in getFavorites controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Add movie to favorites
// @route   POST /api/favorites/:movieId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);
    try {
      await tmdbService.getMovieDetails(movieId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }
    const user = await User.findById(req.user._id);
    const alreadyFavorite = user.favorites.some(
      (fav) => fav.movieId === movieId
    );

    if (alreadyFavorite) {
      return res.status(400).json({
        success: false,
        message: "Movie already in favorites",
      });
    }

    user.favorites.push({ movieId });
    await user.save();

    res.status(201).json({
      success: true,
      message: "Movie added to favorites",
      data: { movieId, addedAt: new Date() },
    });
  } catch (error) {
    console.error("Error in addFavorite controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const movieId = parseInt(req.params.movieId);

    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter((fav) => fav.movieId !== movieId);
    await user.save();

    res.json({
      success: true,
      message: "Movie removed from favorites",
      data: { movieId },
    });
  } catch (error) {
    console.error("Error in removeFavorite controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
