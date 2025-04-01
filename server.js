const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();
const app = express();

app.use(
  cors({
    origin: ["https://cinescope-kappa.vercel.app", "http://localhost:5173"],
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
app.use("/api/test", require("./routes/testRoutes"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to CINESCOPE API" });
});

// error handler
app.use(errorHandler);

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
