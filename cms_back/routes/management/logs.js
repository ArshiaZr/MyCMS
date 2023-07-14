const mongoose = require("mongoose");
const router = require("express").Router();
const path = require("path");

require("dotenv").config();

// Middlewares
const auth = require(path.join(
  __dirname,
  "../../middlewares/authentication/auth"
));
const getAdmin = require(path.join(
  __dirname,
  "../../middlewares/authentication/getAdmin"
));
const getRole = require(path.join(
  __dirname,
  "../../middlewares/authentication/getRole"
));

// helper functions
const utils = require(path.join(__dirname, "../../lib/utils"));

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Success Manager
const SuccessManager = require(path.join(
  __dirname,
  "../../lib/SuccessManager"
));

// Constants
const { VERIFIED, ENABLED, LOG_MANAGEMENT } = require(path.join(
  __dirname,
  "../../constants"
));

/* Log Mangement */

// Get all logs
router.get("/", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(req.admin, req.role.permissions, LOG_MANAGEMENT, [
      ENABLED,
      VERIFIED,
    ])
  ) {
    return utils.logAndReturn(
      401,
      { success: false, msg: ErrorManager.accessDenied() },
      req,
      res
    );
  }
  return await mongoose.connection.db.collection(
    "logs",
    async (err, collection) => {
      if (err) {
        return utils.logAndReturn(
          400,
          { success: false, errors: err },
          req,
          res
        );
      }
      let logs = await collection.find().toArray();
      if (utils.isEmpty(logs)) {
        return utils.logAndReturn(
          404,
          { success: false, msg: ErrorManager.notFound() },
          req,
          res
        );
      }
      return res.status(200).json({ success: false, logs });
    }
  );
});

module.exports = router;
