const mongoose = require("mongoose");
const router = require("express").Router();
const path = require("path");
const fs = require("fs");

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
const getRoles = require(path.join(
  __dirname,
  "../../middlewares/authentication/getRoles"
));

const updateEmployees = require(path.join(
  __dirname,
  "../../middlewares/fixings/updateEmployees"
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
const { ADMIN_MANAGEMENT, VERIFIED, ENABLED } = require(path.join(
  __dirname,
  "../../constants"
));

// Verification Templates
const { adminAccountDelete, adminRoleChange } = require(path.join(
  __dirname,
  "../../EmailTemplates"
));

// Validations
const { validateRequests } = require(path.join(
  __dirname,
  "../../components/validation"
));

/* Admin management */

// Get all admins except self
router.get("/", auth, getAdmin, getRole, getRoles, async (req, res, next) => {
  if (
    !utils.checkCredibility(req.admin, req.role.permissions, ADMIN_MANAGEMENT, [
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
  Admin.find({ _id: { $ne: req.admin._id } }).then((admins) => {
    return utils.logAndReturn(
      200,
      { success: true, admins, roles: req.roles },
      req,
      res
    );
  });
});

// get self by token
router.get(
  "/self",
  auth,
  getAdmin,
  getRole,
  updateEmployees,
  async (req, res, next) => {
    try {
      let tmp = { ...req.admin._doc };
      if (tmp.salt) {
        delete tmp.salt;
      }
      if (tmp.hash) {
        delete tmp.hash;
      }
      tmp.permissions = req.role.permissions;
      tmp.employees = req.role.employees;
      return utils.logAndReturn(200, { success: true, admin: tmp }, req, res);
    } catch (err) {
      return utils.logAndReturn(
        400,
        { success: false, msg: ErrorManager.other() },
        req,
        res
      );
    }
  }
);

// Register administrator
router.post("/register-admin", async (req, res, next) => {
  const validationOptions = [
    {
      title: "username",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("username"),
      },
      length: {
        value: [3, 20],
        error: ErrorManager.createLengthErrorMessage("username", 3, 20),
      },
      error: ErrorManager.createInvalidErrorMessage("username"),
    },
    {
      title: "password",
      type: "password",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("password"),
      },
      length: {
        value: [8, 30],
      },
    },
    {
      title: "super_password",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("super_password"),
      },
    },
  ];
  let { isValid, errors } = validateRequests(req.body, validationOptions);
  if (!isValid) {
    return utils.logAndReturn(400, { success: false, errors }, req, res);
  }
  req.body.super_password = req.body.super_password.toString();
  if (req.body.super_password !== process.env.ADMIN_SUPER_PASSWORD) {
    return utils.logAndReturn(
      401,
      { success: false, msg: ErrorManager.accessDenied() },
      req,
      res
    );
  }

  Admin.findOne().then((admin) => {
    if (!utils.isEmpty(admin)) {
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

    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newAdmin = new Admin({
      username: req.body.username.toLowerCase(),
      hash: hash,
      salt: salt,
      role: "administrator",
      verified: true,
      enabled: true,
    });

    try {
      newAdmin.save().then((admin) => {
        return utils.logAndReturn(
          200,
          { success: true, user: admin },
          req,
          res
        );
      });
    } catch (err) {
      return utils.logAndReturn(400, { success: false, msg: err }, req, res);
    }
  });
});

// Register a new admin
router.post(
  "/register",
  auth,
  getAdmin,
  getRole,
  getRoles,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        ADMIN_MANAGEMENT,
        [ENABLED, VERIFIED]
      )
    ) {
      return utils.logAndReturn(
        401,
        { success: false, msg: ErrorManager.accessDenied() },
        req,
        res
      );
    }

    const validationOptions = [
      {
        title: "username",
        type: "text",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("username"),
        },
        length: {
          value: [3, 20],
          error: ErrorManager.createLengthErrorMessage("username", 3, 20),
        },
        error: ErrorManager.createInvalidErrorMessage("username"),
      },
      {
        title: "password",
        type: "password",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("password"),
        },
        length: {
          value: [8, 30],
        },
      },
      {
        title: "role",
        type: "options",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("role"),
        },
        validOptions: {
          value: req.roles.map((role) => role.title),
        },
        error: ErrorManager.createInvalidErrorMessage("role"),
      },
    ];
    let { isValid, errors } = validateRequests(req.body, validationOptions);
    if (!isValid) {
      return utils.logAndReturn(400, { success: false, errors }, req, res);
    }
    req.body.username = req.body.username.toLowerCase();
    req.body.role = req.body.role.toLowerCase();

    Admin.findOne({ username: req.body.username }).then((admin) => {
      if (!utils.isEmpty(admin)) {
        return utils.logAndReturn(
          404,
          { success: false, msg: ErrorManager.accountExists() },
          req,
          res
        );
      }
      const saltHash = utils.genPassword(req.body.password);

      const salt = saltHash.salt;
      const hash = saltHash.hash;

      const newAdmin = new Admin({
        username: req.body.username,
        hash: hash,
        salt: salt,
        role: req.body.role,
      });

      try {
        newAdmin.save().then((admin) => {
          return utils.logAndReturn(
            200,
            { success: true, msg: SuccessManager.accountCreatedSuccessfully() },
            req,
            res
          );
        });
      } catch (err) {
        return utils.logAndReturn(
          400,
          {
            success: false,
            msg: err,
          },
          req,
          res
        );
      }
    });
  }
);

// change an admin role
router.post(
  "/change-role/:id",
  auth,
  getAdmin,
  getRole,
  getRoles,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        ADMIN_MANAGEMENT,
        [ENABLED, VERIFIED]
      )
    ) {
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

    let role = req.body.role;
    const validationOptions = [
      {
        title: "role",
        type: "options",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("role"),
        },
        validOptions: {
          value: req.roles.map((role) => role.title),
        },
        error: ErrorManager.createInvalidErrorMessage("role"),
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
    role = role.toLowerCase();
    Admin.findById(req.params.id)
      .then(async (admin) => {
        admin.role = role;
        admin.dateModified = Date.now();
        admin
          .save()
          .then(async (ret) => {
            if (admin.email) {
              await utils.sendMail(
                admin.email,
                "Your role has changed",
                adminRoleChange(admin)
              );
            }
            return utils.logAndReturn(
              200,
              { success: true, admin: ret },
              req,
              res
            );
          })
          .catch((err) => {
            return utils.logAndReturn(
              400,
              { success: false, msg: err },
              req,
              res
            );
          });
      })
      .catch((err) => {
        return utils.logAndReturn(400, { success: false, msg: err }, req, res);
      });
  }
);

// delete an admin
router.delete("/:id", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(req.admin, req.role.permissions, ADMIN_MANAGEMENT, [
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
  Admin.findByIdAndDelete(req.params.id, async (err, deleted) => {
    if (err || utils.isEmpty(deleted)) {
      return utils.logAndReturn(
        404,
        {
          success: false,
          msg: ErrorManager.accountDoesNotExist(),
        },
        req,
        res
      );
    } else {
      if (deleted.email) {
        await utils.sendMail(
          deleted.email,
          "Your Account has deleted",
          adminAccountDelete(deleted)
        );
      }
      if (deleted.image) {
        if (fs.existsSync("uploads/" + deleted.image))
          fs.unlink("uploads/" + deleted.image, (err) => {
            if (err) {
              return utils.logAndReturn(
                400,
                {
                  success: false,
                  msg: err,
                },
                req,
                res
              );
            }
          });
      }
      return utils.logAndReturn(
        200,
        {
          success: true,
          msg: deleted,
        },
        req,
        res
      );
    }
  });
});

// toggle enable and disable an admin
router.patch(
  "/enabled/:id",
  auth,
  getAdmin,
  getRole,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        ADMIN_MANAGEMENT,
        [ENABLED, VERIFIED]
      )
    ) {
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
    Admin.findById(req.params.id)
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
        admin.enabled = !admin.enabled;
        admin.dateModified = Date.now();
        admin
          .save()
          .then((ret) => {
            return utils.logAndReturn(
              200,
              {
                success: true,
                admin: ret,
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
                msg: err,
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
            msg: ErrorManager.accountDoesNotExist(),
          },
          req,
          res
        );
      });
  }
);

// toggle verified and unverified an admin
router.patch(
  "/verified/:id",
  auth,
  getAdmin,
  getRole,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        ADMIN_MANAGEMENT,
        [ENABLED, VERIFIED]
      )
    ) {
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
    Admin.findById(req.params.id)
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
        admin.verified = !admin.verified;
        admin.dateModified = Date.now();
        admin
          .save()
          .then((ret) => {
            return utils.logAndReturn(
              200,
              {
                success: true,
                admin: ret,
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
                msg: err,
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
            msg: ErrorManager.accountDoesNotExist(),
          },
          req,
          res
        );
      });
  }
);

module.exports = router;
