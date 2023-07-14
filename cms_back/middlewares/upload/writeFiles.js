const path = require("path");
const fs = require("fs");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Constants
const { UPLOAD_PATH } = require(path.join(__dirname, "../../constants"));

// helper functions
const { isEmpty, logAndReturn } = require(path.join(
  __dirname,
  "../../lib/utils"
));

const writeFiles = (sub_path, successMessage) => {
  return (req, res) => {
    const files = req.files;
    try {
      let existsCheck = Object.keys(files).every((key) => {
        if (isEmpty(files[key].setName)) {
          throw new Error("setName has not been set");
        }
        const filepath = path.join(
          __dirname,
          "../..",
          UPLOAD_PATH,
          sub_path,
          files[key].setName
        );
        if (fs.existsSync(filepath)) {
          return logAndReturn(
            500,
            { success: false, msg: ErrorManager.fileAlreadyExists() },
            req,
            res
          );
        }
      });
      if (existsCheck) {
        return;
      }
      let saveCheck = Object.keys(files).forEach((key) => {
        const filepath = path.join(
          __dirname,
          "../..",
          UPLOAD_PATH,
          sub_path,
          files[key].setName
        );
        files[key].mv(filepath, (err) => {
          if (err) {
            return logAndReturn(500, { success: false, msg: err }, req, res);
          }
        });
      });
      if (saveCheck) {
        return;
      }
    } catch (err) {
      return logAndReturn(
        400,
        { success: false, msg: ErrorManager.other() },
        req,
        res
      );
    }
    return logAndReturn(200, { success: true, msg: successMessage }, req, res);
  };
};

module.exports = writeFiles;
