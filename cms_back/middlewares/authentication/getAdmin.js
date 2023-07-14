const mongoose = require("mongoose");
const path = require("path");

// Import models
const Admin = mongoose.model("Admin");

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

function getAdmin(req, res, next) {
  if (isEmpty(req.jwt.sub)) {
    return logAndReturn(
      400,
      { success: false, message: ErrorManager.accessDenied() },
      req,
      res
    );
  }
  return Admin.findById(req.jwt.sub)
    .then((admin) => {
      if (isEmpty(admin)) {
        return logAndReturn(
          400,
          {
            success: false,
            message: ErrorManager.accountDoesNotExist(),
          },
          req,
          res
        );
      }
      req.admin = admin;
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

module.exports = getAdmin;
