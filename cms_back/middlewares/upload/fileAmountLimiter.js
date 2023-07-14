const path = require("path");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Helper functions
const { logAndReturn } = require(path.join(__dirname, "../../lib/utils"));

const fileAmountLimiter = (allowedAmount) => {
  return (req, res, next) => {
    const files = req.files;

    if (Object.keys(files).length !== allowedAmount) {
      return logAndReturn(
        422,
        {
          success: false,
          msg: ErrorManager.createUploadAmountLimit(allowedAmount),
        },
        req,
        res
      );
    }

    next();
  };
};

module.exports = fileAmountLimiter;
