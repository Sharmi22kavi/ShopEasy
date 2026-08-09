const path = require("path");
const userRoutes = require("./routes/userroutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const pool = require("./config/postgres");
const orderRoutes = require("./routes/orderroutes");



dotenv.config({
  path: path.join(__dirname, ".env"),
});
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connect
connectDB();

// PostgreSQL Connect
pool.connect()
  .then(() => {
    console.log("PostgreSQL Connected");
  })
  .catch((err) => {
    console.log("PostgreSQL Error:", err.message);
  });

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use(express.static(path.join(__dirname, "../frontend")));
// Test Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on Port ${PORT}`);
});