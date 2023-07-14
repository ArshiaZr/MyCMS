const router = require("express").Router();
const path = require("path");

require("dotenv").config();

// Middlewares
const auth = require(path.join(
  __dirname,
  "../../middlewares/authentication/auth"
));

// helper functions
const utils = require(path.join(__dirname, "../../lib/utils"));

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Constants
const { ALLPERMISSIONS } = require(path.join(__dirname, "../../constants"));

/* Permissions */

// Get all permissions
router.get("/", auth, async (req, res, next) => {
  try {
    return utils.logAndReturn(
      200,
      { success: true, permissions: ALLPERMISSIONS },
      req,
      res
    );
  } catch (err) {
    return utils.logAndReturn(
      400,
      { success: false, msg: ErrorManager.other() },
      req,
      res
    );
  }
});

module.exports = router;
