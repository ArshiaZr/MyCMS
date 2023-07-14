const path = require("path");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Helper functions
const { logAndReturn } = require(path.join(__dirname, "../../lib/utils"));

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const files = req.files;

    const fileExtensions = [];
    let success = true;
    Object.keys(files).forEach((key) => {
      if (Array.isArray(files[key]) && files[key].length !== 1) {
        success = false;
        return;
      }
      fileExtensions.push(path.extname(files[key].name));
    });

    if (success == false) {
      return logAndReturn(
        422,
        {
          success: false,
          msg: ErrorManager.filesShouldHaveDifferentNames(),
        },
        req,
        res
      );
    }

    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      return logAndReturn(
        422,
        {
          success: false,
          msg: ErrorManager.createFileExtLimit(allowedExtArray),
        },
        req,
        res
      );
    }

    next();
  };
};

module.exports = fileExtLimiter;
