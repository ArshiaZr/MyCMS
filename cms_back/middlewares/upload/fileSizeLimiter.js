const path = require("path");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Helper functions
const { logAndReturn } = require(path.join(__dirname, "../../lib/utils"));

// Constants
const { FILES_SIZE_LIMIT_MB } = require(path.join(
  __dirname,
  "../../constants"
));

const FILE_SIZE_LIMIT = FILES_SIZE_LIMIT_MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;

  const filesOverLimit = [];
  // Which files are over the limit?
  Object.keys(files).forEach((key) => {
    if (files[key].size > FILE_SIZE_LIMIT) {
      filesOverLimit.push(files[key].name);
    }
  });

  if (filesOverLimit.length) {
    return logAndReturn(
      413,
      {
        success: false,
        msg: ErrorManager.createFileSizeLimit(
          FILES_SIZE_LIMIT_MB,
          filesOverLimit
        ),
      },
      req,
      res
    );
  }

  next();
};

module.exports = fileSizeLimiter;
