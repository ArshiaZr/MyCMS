const path = require("path");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");

// Utils
const utils = require(path.join(__dirname, "../../lib/utils.js"));

// Keys
const pathToPubKey = path.join(__dirname, "..", "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

/**
 * This is an authentication middleware function
 */
function authMiddleware(req, res, next) {
  if (utils.isEmpty(req.headers.authorization)) {
    return utils.logAndReturn(
      401,
      {
        success: false,
        msg: ErrorManager.accessDenied(),
      },
      req,
      res
    );
  }
  const tokenParts = req.headers.authorization.split(" ");
  if (
    tokenParts.length == 2 &&
    tokenParts[0] === "Bearer" &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
        algorithms: ["RS256"],
      });
      req.jwt = verification;
      next();
    } catch (err) {
      return utils.logAndReturn(
        401,
        {
          success: false,
          msg: ErrorManager.accessDenied(),
        },
        req,
        res
      );
    }
  } else {
    return utils.logAndReturn(
      401,
      {
        success: false,
        msg: ErrorManager.accessDenied(),
      },
      req,
      res
    );
  }
}

module.exports = authMiddleware;
