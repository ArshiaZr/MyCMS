const mongoose = require("mongoose");
const path = require("path");

// Import models
const Role = mongoose.model("Role");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Helper functions
const { isEmpty, logAndReturn } = require(path.join(
  __dirname,
  "../../lib/utils"
));

/**
 * A middleware which gets an admin information
 */

function getRoles(req, res, next) {
  if (isEmpty(req.jwt.sub)) {
    return logAndReturn(
      400,
      { success: false, message: ErrorManager.accessDenied() },
      req,
      res
    );
  }
  return Role.find()
    .then((roles) => {
      if (isEmpty(roles)) {
        roles = [];
      }
      req.roles = roles;
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

module.exports = getRoles;
