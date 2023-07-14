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

async function getRole(req, res, next) {
  if (isEmpty(req.jwt.sub)) {
    return logAndReturn(
      400,
      { success: false, msg: ErrorManager.accessDenied() },
      req,
      res
    );
  }
  if (isEmpty(req.admin.role)) {
    return logAndReturn(
      400,
      { success: false, msg: ErrorManager.accessDenied() },
      req,
      res
    );
  }
  return Role.findOne({ title: req.admin.role })
    .then(async (role) => {
      if (isEmpty(role)) {
        req.admin.role = "";
        let adminRes = await req.admin
          .save()
          .then(() => {
            return true;
          })
          .catch((err) => {
            return false;
          });
        if (adminRes) {
          return logAndReturn(
            400,
            { success: false, msg: ErrorManager.accessDenied() },
            req,
            res
          );
        } else {
          return logAndReturn(
            400,
            { success: false, msg: ErrorManager.other() },
            req,
            res
          );
        }
      }
      req.role = role;
      return next();
    })
    .catch((err) => {
      return logAndReturn(
        400,
        { success: false, msg: ErrorManager.other() },
        req,
        res
      );
    });
}

module.exports = getRole;
