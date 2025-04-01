const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();
const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "https://cinescope-kappa.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/tv", require("./routes/tvRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/genres", require("./routes/genreRoutes"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to CINESCOPE API" });
});

// Define a simple error handler if the imported one is not working
const fallbackErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

// Use the fallback error handler if errorHandler is not a function
app.use(
  typeof errorHandler === "function" ? errorHandler : fallbackErrorHandler
);

// Add better error logging
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
