const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const logger = require(path.join(__dirname, "./logs/logger.js"));

/**
 * -------------- GENERAL SETUP ----------------
 */

var app = express();

//import database
require(path.join(__dirname, "./config/database"));

//Import email Handler
require(path.join(__dirname, "./config/email"));

// Load the models
require(path.join(__dirname, "./models/admin"));
require(path.join(__dirname, "./models/role"));
require(path.join(__dirname, "./models/content"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.set("trust proxy", true);

// Imports all of the routes from ./routes/index.js
app.use(require(path.join(__dirname, "./routes")));

/**
 * -------------- SERVER ----------------
 */

const port = process.env.PORT || 3000;
// Server listens on http://localhost:3000
app.listen(port, () => {
  logger.log("debug", `Application listens on port ${port}`);
});
