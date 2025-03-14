const express = require("express");
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getFavorites);
router.post("/:movieId", protect, addFavorite);
router.delete("/:movieId", protect, removeFavorite);

module.exports = router;
