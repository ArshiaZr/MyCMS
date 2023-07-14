const mongoose = require("mongoose");
const path = require("path");

// Import models
const User = mongoose.model("User");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../lib/ErrorManager"));

// Helper functions
const { isEmpty, logAndReturn } = require(path.join(__dirname, "./utils"));

/**
 * A middleware which gets a user information
 */
function getUser(req, res, next) {
  if (isEmpty(req.jwt.sub)) {
    return logAndReturn(
      400,
      { success: false, message: ErrorManager.accessDenied() },
      req,
      res
    );
  }
  return User.findById(req.jwt.sub)
    .then((user) => {
      if (isEmpty(user)) {
        return logAndReturn(
          400,
          { success: false, message: ErrorManager.accountExists() },
          req,
          res
        );
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      return logAndReturn(
        400,
        { success: false, message: ErrorManager.other() },
        req,
        res
      );
    });
}

module.exports = getUser;
