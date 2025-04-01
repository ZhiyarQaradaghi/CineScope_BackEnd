const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ message: "Backend is connected!", timestamp: new Date() });
});

module.exports = router;
