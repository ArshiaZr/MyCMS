const mongoose = require("mongoose");
const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const jsonwebtoken = require("jsonwebtoken");

require("dotenv").config();

// Models
const Admin = mongoose.model("Admin");

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
const filesPayloadExists = require(path.join(
  __dirname,
  "../../middlewares/upload/filesPayloadExists"
));
const fileExtLimiter = require(path.join(
  __dirname,
  "../../middlewares/upload/fileExtLimiter"
));
const fileSizeLimiter = require(path.join(
  __dirname,
  "../../middlewares/upload/fileSizeLimiter"
));
const fileAmountLimiter = require(path.join(
  __dirname,
  "../../middlewares/upload/fileAmountLimiter"
));
const writeFiles = require(path.join(
  __dirname,
  "../../middlewares/upload/writeFiles"
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
const {
  IMAGE_ALLOWED_EXT,

  ADMIN_PROFILE_IMAGE_SUB_PATH,
} = require(path.join(__dirname, "../../constants"));

// Verification Templates
const {
  adminVerificationLink,
  adminAccountVerified,
  adminPasswordResetLink,
} = require(path.join(__dirname, "../../EmailTemplates"));

// Keys
const pathToKey = path.join(__dirname, "../..", "id_rsa_priv.pem");
const pathToPubKey = path.join(__dirname, "../..", "id_rsa_pub.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

// Validations
const { validateRequests } = require(path.join(
  __dirname,
  "../../components/validation"
));

/* Account Management */

// Validate an existing user and issue a JWT
router.post("/login", async (req, res, next) => {
  const validationOptions = [
    {
      title: "username",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("username"),
      },
      error: ErrorManager.createInvalidErrorMessage("username"),
    },
    {
      title: "password",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("password"),
      },
      error: ErrorManager.createInvalidErrorMessage("password"),
    },
  ];
  let { isValid, errors } = validateRequests(req.body, validationOptions);
  if (!isValid) {
    return utils.logAndReturn(400, { success: false, errors }, req, res);
  }
  Admin.findOne({ username: req.body.username.toString().toLowerCase() })
    .then((admin) => {
      if (utils.isEmpty(admin)) {
        return utils.logAndReturn(
          401,
          { success: false, msg: ErrorManager.authFailed() },
          req,
          res
        );
      }

      const isValid = utils.validPassword(
        req.body.password,
        admin.hash,
        admin.salt
      );
      if (admin.isPasswordChanging) {
        return utils.logAndReturn(
          401,
          { success: false, msg: ErrorManager.passwordChange() },
          req,
          res
        );
      }

      if (isValid) {
        const tokenObject = utils.issueJWT(admin);

        return utils.logAndReturn(
          200,
          {
            success: true,
            token: tokenObject.token,
            expiresIn: tokenObject.expires,
            admin: {
              role: admin.role,
              enabled: admin.enabled,
              verified: admin.verified,
              image: admin.image,
              username: admin.username,
            },
          },
          req,
          res
        );
      } else {
        return utils.logAndReturn(
          400,
          {
            success: false,
            msg: ErrorManager.wrongUserPass(),
          },
          req,
          res
        );
      }
    })
    .catch((err) => {
      return utils.logAndReturn(400, { success: false, err }, req, res);
    });
});

// Forgot password
router.post("/forgot-password", async (req, res, next) => {
  const validationOptions = [
    {
      title: "username",
      type: "text",
      required: {
        value: false,
        error: ErrorManager.createRequirementErrorMessage("username"),
      },
      error: ErrorManager.createInvalidErrorMessage("username"),
    },
    {
      title: "email",
      type: "text",
      required: {
        value: false,
        error: ErrorManager.createRequirementErrorMessage("email"),
      },
      error: ErrorManager.createInvalidErrorMessage("email"),
    },
  ];
  let { isValid, errors } = validateRequests(req.body, validationOptions);
  if (!isValid) {
    return utils.logAndReturn(
      400,
      {
        success: false,
        errors,
      },
      req,
      res
    );
  }

  if (utils.isEmpty(req.body.username) && utils.isEmpty(req.body.email)) {
    return utils.logAndReturn(
      400,
      {
        success: false,
        msg: ErrorManager.atLeastOneIsRequired(),
      },
      req,
      res
    );
  }

  Admin.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  })
    .then((admin) => {
      if (utils.isEmpty(admin)) {
        return utils.logAndReturn(
          404,
          {
            success: false,
            msg: ErrorManager.accountDoesNotExist(),
          },
          req,
          res
        );
      }
      admin.isPasswordChanging = true;
      admin
        .save()
        .then((savedAdmin) => {
          const signedToken = jsonwebtoken.sign(
            {
              sub: savedAdmin._id,
            },
            PRIV_KEY,
            {
              expiresIn: "10m",
              algorithm: "RS256",
            }
          );

          let urlEncodedToken = encodeURIComponent(
            `${savedAdmin.username} ${signedToken}`
          );

          EmailHandler.sendEmail(
            "Admin",
            savedAdmin.email,
            "Verify your account",
            "Verification",
            adminPasswordResetLink(savedAdmin, urlEncodedToken)
          );

          return utils.logAndReturn(
            200,
            {
              success: true,
              msg: SuccessManager.passwordResetLinkSent(),
            },
            req,
            res
          );
        })
        .catch((err) => {
          return utils.logAndReturn(
            400,
            {
              success: false,
              msg: ErrorManager.other(),
            },
            req,
            res
          );
        });
    })

    .catch((err) => {
      return utils.logAndReturn(
        400,
        {
          success: false,
          errors: err,
        },
        req,
        res
      );
    });
});

// Validate an existing user and issue a JWT
router.post("/new-password", async (req, res, next) => {
  const validationOptions = [
    {
      title: "username",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("username"),
      },
      error: ErrorManager.createInvalidErrorMessage("username"),
    },
    {
      title: "token",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("token"),
      },
      error: ErrorManager.createInvalidErrorMessage("token"),
    },
    {
      title: "new_password",
      type: "password",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("new_password"),
      },
      length: {
        value: [8, 30],
      },
    },
  ];
  let { isValid, errors } = validateRequests(req.body, validationOptions);
  if (!isValid) {
    return utils.logAndReturn(
      400,
      {
        success: false,
        errors,
      },
      req,
      res
    );
  }
  Admin.findOne({ username: req.body.username.toString().toLowerCase() })
    .then((admin) => {
      if (utils.isEmpty(admin)) {
        return utils.logAndReturn(
          401,
          {
            success: false,
            msg: ErrorManager.authFailed(),
          },
          req,
          res
        );
      }

      if (!admin.isPasswordChanging) {
        return utils.logAndReturn(
          403,
          {
            success: false,
            msg: ErrorManager.accessDenied(),
          },
          req,
          res
        );
      }

      req.body.token = "Bearer " + req.body.token;
      if (!utils.validateToken(req.body.token, [["sub", admin._id]])) {
        return utils.logAndReturn(
          403,
          {
            success: false,
            msg: ErrorManager.accessDenied(),
          },
          req,
          res
        );
      }

      const saltHash = utils.genPassword(req.body.new_password);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      admin.hash = hash;
      admin.salt = salt;
      admin.isPasswordChanging = false;

      admin
        .save()
        .then((admin) => {
          return utils.logAndReturn(
            200,
            {
              success: true,
              msg: SuccessManager.passwordChangedSuccessfully(),
            },
            req,
            res
          );
        })
        .catch((err) => {
          return utils.logAndReturn(
            400,
            {
              success: false,
              msg: ErrorManager.other(),
            },
            req,
            res
          );
        });
    })
    .catch((err) => {
      return utils.logAndReturn(
        400,
        {
          success: false,
          errors: err,
        },
        req,
        res
      );
    });
});

// complete admin account
router.post(
  "/complete",
  auth,
  getAdmin,
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(IMAGE_ALLOWED_EXT),
  fileSizeLimiter,
  fileAmountLimiter(1),
  async (req, res, next) => {
    const { firstname, lastname, phonenumber, email } = req.body;
    const validationOptions = [
      {
        title: "firstname",
        type: "text",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("firstname"),
        },
        error: ErrorManager.createInvalidErrorMessage("firstname"),
      },
      {
        title: "lastname",
        type: "text",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("lastname"),
        },
        error: ErrorManager.createInvalidErrorMessage("firstname"),
      },
      {
        title: "phonenumber",
        type: "phonenumber",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("phonenumber"),
        },
        error: ErrorManager.createInvalidErrorMessage("phonenumber"),
      },
      {
        title: "email",
        type: "email",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("email"),
        },
        error: ErrorManager.createInvalidErrorMessage("email"),
      },
      {
        title: "newpassword",
        type: "password",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("newpassword"),
        },
        length: {
          value: [8, 30],
        },
      },
    ];
    let { isValid, errors } = validateRequests(req.body, validationOptions);
    if (!isValid) {
      return utils.logAndReturn(
        400,
        {
          success: false,
          errors,
        },
        req,
        res
      );
    }
    if (!utils.isEmpty(errors)) {
      return utils.logAndReturn(
        400,
        {
          success: false,
          errors,
        },
        req,
        res
      );
    }

    Admin.findById(req.jwt.sub).then(async (admin) => {
      if (utils.isEmpty(admin)) {
        return utils.logAndReturn(
          404,
          {
            success: false,
            msg: ErrorManager.accountDoesNotExist(),
          },
          req,
          res
        );
      }

      if (admin.verified) {
        return utils.logAndReturn(
          409,
          {
            success: false,
            msg: ErrorManager.accountAlreadyComplete(),
          },
          req,
          res
        );
      }

      // Set setName
      let ext = "";
      Object.keys(req.files).forEach((key) => {
        ext = path.extname(req.files[key].name);
        req.files[key] = {
          ...req.files[key],
          setName: "admin-prof-" + admin._id.toString() + ext,
        };
      });

      admin.firstname = firstname.toLowerCase();
      admin.lastname = lastname.toLowerCase();
      admin.phonenumber = phonenumber;
      admin.email = email.toLowerCase();
      admin.image = "admin-prof-" + admin._id.toString() + ext;
      admin.dateModified = Date.now();
      const { salt, hash } = utils.genPassword(req.body.newpassword);
      admin.salt = salt;
      admin.hash = hash;

      await admin
        .save()
        .then(async (ret) => {
          const signedToken = jsonwebtoken.sign(
            {
              sub: admin._id,
            },
            PRIV_KEY,
            {
              expiresIn: "10m",
              algorithm: "RS256",
            }
          );
          EmailHandler.sendEmail(
            "Admin",
            admin.email,
            "Verify your account",
            "Verification",
            adminVerificationLink(admin, signedToken)
          );

          next();
        })
        .catch((err) => {
          return utils.logAndReturn(
            400,
            {
              success: false,
              msg: err,
            },
            req,
            res
          );
        });
    });
  },
  writeFiles(ADMIN_PROFILE_IMAGE_SUB_PATH, SuccessManager.accountCompleted())
);

// activate account
router.get("/activate/:token", async (req, res, next) => {
  const token = req.params.token;
  if (!utils.isEmpty(token)) {
    const verification = jsonwebtoken.verify(
      token,
      PUB_KEY,
      {
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          return false;
        }
        return decoded;
      }
    );
    if (verification && verification.sub) {
      Admin.findById(verification["sub"])
        .then(async (admin) => {
          if (utils.isEmpty(admin)) {
            return utils.logAndReturn(
              404,
              {
                success: false,
                msg: ErrorManager.verificationNotMatch(),
              },
              req,
              res
            );
          }
          if (admin.verified) {
            return utils.logAndReturn(
              400,
              {
                success: false,
                msg: ErrorManager.accountAlreadyVerified(),
              },
              req,
              res
            );
          }

          admin.verified = true;
          admin.dateModified = Date.now();
          admin.save().then(async (ret) => {
            await utils.sendMail(
              admin.email,
              "Your account is now verified",
              adminAccountVerified(admin)
            );
            return utils.logAndReturn(
              200,
              {
                success: true,
                msg: SuccessManager.verifiedSuccessfully(),
              },
              req,
              res
            );
          });
        })
        .catch((err) => {
          return utils.logAndReturn(
            400,
            { success: false, msg: err },
            req,
            res
          );
        });
    } else {
      return utils.logAndReturn(
        400,
        { success: false, msg: ErrorManager.other() },
        req,
        res
      );
    }
  } else {
    return utils.logAndReturn(
      400,
      { success: false, msg: ErrorManager.other() },
      req,
      res
    );
  }
});

module.exports = router;
