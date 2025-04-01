const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();
const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "https://cinescope-kappa.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Remove or comment out the existing CORS middleware
// app.use(
//   cors({
//     origin: ["https://cinescope-kappa.vercel.app", "http://localhost:5173"],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

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
