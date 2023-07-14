const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// Keys
const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

//Logger
const logger = require(path.join(__dirname, "../logs/logger.js"));

// Email Setup
const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  const _id = user._id;

  const expiresIn = "1d";

  let payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

/**
 * @param {*} token - The jwt issued token
 * @param {*} rules - The given rules(first element of each elements of rules array in the given should be eqaul to the second element)
 */
function validateToken(token, rules) {
  const tokenParts = token.toString().trim().split(" ");

  if (
    !(
      tokenParts.length == 2 &&
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    )
  ) {
    return false;
  }
  try {
    const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
      algorithms: ["RS256"],
    });
    for (let i = 0; i < rules.length; i++) {
      if (
        !verification[rules[i][0]] &&
        verification[rules[i][0]] !== rules[i][1]
      ) {
        return false;
      }
    }
  } catch (err) {
    return false;
  }

  return true;
}

const isEmpty = (input) => {
  return (
    input === undefined ||
    input === null ||
    (typeof input === "object" && Object.keys(input).length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  );
};

/**
 *
 * @param {*} admin - The admin Object
 * @param {*} adminPermissions - Admin's permissions
 * @param {*} neededPermission - The needed permission for the act
 * @param {*} atributeArray - The attributes that needed to be set and true
 *
 * This function uses the admin id and role to find if the admin is eligible
 */
function checkCredibility(
  admin,
  adminPermissions,
  neededPermission,
  atributeArray = []
) {
  if (isEmpty(adminPermissions)) {
    return false;
  }
  for (let i = 0; i < atributeArray.length; i++) {
    if (!admin[atributeArray[i]]) {
      return false;
    }
  }
  return adminPermissions.includes(neededPermission);
}

/**
 * This function converts a vaild date text to milliseconds
 */
function textDateToMillisec(text) {
  let miltiplier = 1;
  switch (text.slice(-1)) {
    case "s":
      miltiplier = 1000;
      break;
    case "m":
      miltiplier = 1000 * 60;
      break;
    case "h":
      miltiplier = 1000 * 60 * 60;
      break;
    case "d":
      miltiplier = 1000 * 60 * 60 * 24;
      break;
    case "w":
      miltiplier = 1000 * 60 * 60 * 24 * 7;
      break;
    case "M":
      miltiplier = 1000 * 60 * 60 * 24 * 30;
      break;
    case "y":
      miltiplier = 1000 * 60 * 60 * 24 * 365;
      break;
    default:
      miltiplier = 0;
  }
  return miltiplier * parseInt(text.slice(0, -1));
}

/**
 *
 * @param {*} toEmail - Receiver email
 * @param {*} subject - Subject of the email
 * @param {*} mailBody - The html mail template
 * @param {*} fromEmail - From email
 *
 * This function takes 4 parameters and send email via google api mail
 */

async function sendMail(toEmail, subject, mailBody, fromEmail = SUPPORT_EMAIL) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SUPPORT_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: `Support <${fromEmail}>`,
      to: toEmail,
      subject: subject,
      text: "boo",
      html: mailBody,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    return err;
  }
}

function createLengthErrorMessage(title, from, to) {
  return `The ${title} should contain ${from} to ${to} characters`;
}

function createRequirementErrorMessage(title) {
  return `The ${title} is required`;
}

function createInvalidErrorMessage(title) {
  return `The ${title} is invalid`;
}

function createAddedSuccessfully(title) {
  return `${title} added successfully`;
}

/**
 *
 * @param {*} statusCode - res status code
 * @param {*} returnJson - object to return as json
 * @param {*} req - the original req
 *
 * This function logs an event with given values
 */

function logAndReturn(statusCode, returnJson, req, res) {
  const { method, originalUrl, ip } = req;

  let toLog = {};
  let message = "";
  toLog.ip = ip;
  toLog.originalUrl = originalUrl;
  toLog.method = method;

  if (!isEmpty(req.admin) && !isEmpty(req.admin._id)) {
    toLog.user = req.admin._id;
  }

  if (!isEmpty(returnJson.success)) {
    toLog.success = returnJson.success;
  }

  if (!isEmpty(returnJson.msg)) {
    message = returnJson.msg;
  }

  if (statusCode === 401) {
    logger.log("warn", message, toLog);
  } else {
    logger.log("info", message, toLog);
  }
  return res.status(statusCode).json(returnJson);
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.checkCredibility = checkCredibility;
module.exports.textDateToMillisec = textDateToMillisec;
module.exports.sendMail = sendMail;
module.exports.createInvalidErrorMessage = createInvalidErrorMessage;
module.exports.createLengthErrorMessage = createLengthErrorMessage;
module.exports.createRequirementErrorMessage = createRequirementErrorMessage;
module.exports.createAddedSuccessfully = createAddedSuccessfully;
module.exports.isEmpty = isEmpty;
module.exports.validateToken = validateToken;
module.exports.logAndReturn = logAndReturn;
