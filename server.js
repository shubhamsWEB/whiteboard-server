require('dotenv').config();
const express = require("express");
const { connectDB } = require("./config/db");
const {getOnlineUsersCount} = require('./controllers/userController');
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define any API routes here (if necessary)
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});
app.get('/onlineUsers',(req,res) => {
  getOnlineUsersCount(req,res);
});
//Connect to DB
connectDB();
// Error handling middleware (optional, can handle 404 and general errors)
app.use((req, res, next) => {
  res.status(404).send({ error: "Not Found" });
});

app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).send({ error: "An unexpected error occurred" });
});

module.exports = app;
