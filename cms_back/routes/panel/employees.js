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
const {
  VERIFIED,
  ENABLED,
  EMPLOYEES_MANAGEMENT,
  ADMIN_PROFILE_IMAGE_SUB_PATH,
  UPLOAD_PATH,
} = require(path.join(__dirname, "../../constants"));

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

/* Employee management */

// Get all employees
router.get(
  "/",
  auth,
  getAdmin,
  getRole,
  getRoles,
  updateEmployees,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        EMPLOYEES_MANAGEMENT,
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
    if (utils.isEmpty(req.role.employees)) {
      return utils.logAndReturn(
        200,
        { success: true, employees: [] },
        req,
        res
      );
    }
    Admin.find({ role: { $in: req.role.employees } })
      .then((employees) => {
        employees = employees.map((employee) => {
          return {
            username: employee.username,
            firstname: employee.firstname,
            lastname: employee.lastname,
            phonenumber: employee.phonenumber,
            email: employee.email,
            role: employee.role,
            enabled: employee.enabled,
            verified: employee.verified,
            image: employee.image,
            dateModified: employee.dateModified,
            dateCreated: employee.dateCreated,
            _id: employee._id,
          };
        });
        return utils.logAndReturn(200, { success: true, employees }, req, res);
      })
      .catch((err) => {
        return utils.logAndReturn(
          400,
          { success: false, errors: err },
          req,
          res
        );
      });
  }
);

// change an employee role
router.post(
  "/change-role/:id",
  auth,
  getAdmin,
  getRole,
  updateEmployees,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        EMPLOYEES_MANAGEMENT,
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
          value: req.role.employees,
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

// Delete Employee with ID
router.delete(
  "/:id",
  auth,
  getAdmin,
  getRole,
  updateEmployees,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        EMPLOYEES_MANAGEMENT,
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

    await Admin.findById(req.params.id)
      .then(async (admin) => {
        if (utils.isEmpty(admin)) {
          return utils.logAndReturn(
            404,
            { success: false, msg: ErrorManager.accountDoesNotExist() },
            req,
            res
          );
        }
        if (req.role.employees.includes(admin.role)) {
          admin.delete().then(async (ret) => {
            if (!utils.isEmpty(admin.email)) {
              EmailHandler.sendEmail(
                "Admin",
                admin.email,
                "Verify your account",
                "Verification",
                adminAccountDelete()
              );
            }
            if (admin.image) {
              let image_path = `${UPLOAD_PATH}${ADMIN_PROFILE_IMAGE_SUB_PATH}/${admin.image}`;
              if (fs.existsSync(path.join(__dirname, "..", image_path)))
                fs.unlink(path.join(__dirname, "..", image_path), (err) => {
                  if (err) {
                    return utils.logAndReturn(
                      400,
                      { success: false, err },
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
                msg: SuccessManager.createDeletedSuccessfully(
                  `${admin.username} account`
                ),
              },
              req,
              res
            );
          });
        } else {
          return utils.logAndReturn(
            401,
            { success: false, msg: ErrorManager.accessDenied() },
            req,
            res
          );
        }
      })
      .catch((err) => {
        return utils.logAndReturn(400, { success: false, msg: err }, req, res);
      });
  }
);

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
        EMPLOYEES_MANAGEMENT,
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
        if (!req.role.employees.includes(admin.role)) {
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
  updateEmployees,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        EMPLOYEES_MANAGEMENT,
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
        if (!req.role.employees.includes(admin.role)) {
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

//TODO: ADD EDIT EMPLOYEE
module.exports = router;
