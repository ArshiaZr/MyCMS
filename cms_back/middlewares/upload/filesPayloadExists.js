const path = require("path");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Helper functions
const { logAndReturn } = require(path.join(__dirname, "../../lib/utils"));

const filesPayloadExists = (req, res, next) => {
  if (!req.files) {
    return logAndReturn(
      400,
      {
        success: false,
        msg: ErrorManager.missingFile(),
      },
      req,
      res
    );
  }
  next();
};

module.exports = filesPayloadExists;
