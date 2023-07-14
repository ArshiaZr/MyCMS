const mongoose = require("mongoose");
const router = require("express").Router();
const path = require("path");

require("dotenv").config();

// Models
const Role = mongoose.model("Role");

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
const { VERIFIED, ENABLED, ROLE_MANAGEMENT } = require(path.join(
  __dirname,
  "../../constants"
));

// Validations
const { validateRequests } = require(path.join(
  __dirname,
  "../../components/validation"
));

/* Role management */

// Get all roles
router.get("/", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(req.admin, req.role.permissions, ROLE_MANAGEMENT, [
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
  Role.find({ title: { $in: req.role.employees } })
    .then((roles) => {
      return utils.logAndReturn(200, { success: true, roles }, req, res);
    })
    .catch((err) => {
      return utils.logAndReturn(
        404,
        { success: false, msg: ErrorManager.other() },
        req,
        res
      );
    });
});

//get role by title
router.get("/:title", auth, async (req, res, next) => {
  Role.findOne({ title: req.params.title })
    .then((role) => {
      if (utils.isEmpty(role)) {
        return utils.logAndReturn(
          404,
          { success: false, msg: ErrorManager.roleDoesNotExist() },
          req,
          res
        );
      }
      return utils.logAndReturn(200, { success: true, role }, req, res);
    })
    .catch((err) => {
      return utils.logAndReturn(
        400,
        { success: false, msg: ErrorManager.other() },
        req,
        res
      );
    });
});

// Add Role
router.post(
  "/add",
  auth,
  getAdmin,
  getRole,
  updateEmployees,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        ROLE_MANAGEMENT,
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
        title: "title",
        type: "text",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("title"),
        },
        error: ErrorManager.createInvalidErrorMessage("title"),
      },
    ];
    let { isValid, errors } = validateRequests(req.body, validationOptions);
    if (!isValid) {
      return utils.logAndReturn(400, { success: false, errors }, req, res);
    }

    if (
      !utils.isEmpty(req.body.permissions) &&
      !Array.isArray(req.body.permissions)
    ) {
      errors.permissions = ErrorManager.rolesInvalid();
    }

    if (
      !utils.isEmpty(req.body.employees) &&
      !Array.isArray(req.body.employees)
    ) {
      errors.employees = ErrorManager.rolesInvalid();
    }

    if (!utils.isEmpty(errors)) {
      return utils.logAndReturn(400, { success: false, errors }, req, res);
    }

    req.body.title = req.body.title.toString().toLowerCase();

    Role.findOne({ title: req.body.title })
      .then((role) => {
        if (!utils.isEmpty(role)) {
          return utils.logAndReturn(
            400,
            { success: false, msg: ErrorManager.roleAlreadyExists() },
            req,
            res
          );
        }

        let newRole = new Role({
          title: req.body.title,
        });

        if (!utils.isEmpty(req.body.permissions)) {
          for (let i = 0; i < req.body.permissions.length; i++) {
            req.body.permissions[i] = req.body.permissions[i].toString();
            if (!req.role.permissions.includes(req.body.permissions[i])) {
              return utils.logAndReturn(
                404,
                {
                  success: false,
                  msg: ErrorManager.createInvalidErrorMessage(
                    `'${req.body.permissions[i]}' permission`
                  ),
                },
                req,
                res
              );
            }
          }
          req.body.permissions = Array.from(new Set(req.body.permissions));
          newRole.permissions = req.body.permissions;
        }

        if (!utils.isEmpty(req.body.employees)) {
          for (let i = 0; i < req.body.employees.length; i++) {
            req.body.employees[i] = req.body.employees[i].toString();
            if (!req.role.employees.includes(req.body.employees[i])) {
              return utils.logAndReturn(
                404,
                {
                  success: false,
                  msg: ErrorManager.createInvalidErrorMessage(
                    `'${req.body.employees[i]}' employee`
                  ),
                },
                req,
                res
              );
            }
          }
          req.body.employees = Array.from(new Set(req.body.employees));
          newRole.employees = req.body.employees;
        }
        newRole
          .save()
          .then((role) => {
            req.role.employees.push(role.title);
            req.role
              .save()
              .then(() => {
                return utils.logAndReturn(
                  200,
                  {
                    success: true,
                    msg: SuccessManager.roleSuccessfullyAdded(),
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
              { success: false, msg: ErrorManager.other() },
              req,
              res
            );
          });
      })
      .catch((err) => {
        return utils.logAndReturn(
          400,
          { success: false, msg: ErrorManager.other() },
          req,
          res
        );
      });
  }
);

// Edit Role
router.post(
  "/edit/:id",
  auth,
  getAdmin,
  getRole,
  updateEmployees,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        ROLE_MANAGEMENT,
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
    let errors = {};
    if (
      utils.isEmpty(req.body.title) &&
      utils.isEmpty(req.body.permissions) &&
      utils.isEmpty(req.body.employees)
    ) {
      errors["same inputs"] = ErrorManager.inputsAlreadySet();
      return utils.logAndReturn(400, { success: false, errors }, req, res);
    }

    if (
      !utils.isEmpty(req.body.permissions) &&
      !Array.isArray(req.body.permissions)
    ) {
      errors.permissions = ErrorManager.rolesInvalid();
    }

    if (
      !utils.isEmpty(req.body.employees) &&
      !Array.isArray(req.body.employees)
    ) {
      errors.employees = ErrorManager.rolesInvalid();
    }

    if (!utils.isEmpty(errors)) {
      return utils.logAndReturn(400, { success: false, errors }, req, res);
    }
    let title;
    let permissions;
    let employees;

    if (!utils.isEmpty(req.body.title)) {
      title = req.body.title.toString();
    }

    if (!utils.isEmpty(req.body.permissions)) {
      permissions = req.body.permissions;
    }

    if (!utils.isEmpty(req.body.employees)) {
      employees = req.body.employees;
    }

    if (!utils.isEmpty(permissions)) {
      for (let i = 0; i < permissions.length; i++) {
        permissions[i] = permissions[i].toString();
        if (!req.role.permissions.includes(permissions[i])) {
          return utils.logAndReturn(
            404,
            {
              success: false,
              msg: ErrorManager.createInvalidErrorMessage(
                `'${permissions[i]}' role`
              ),
            },
            req,
            res
          );
        }
      }
      permissions = Array.from(new Set(permissions));
    }

    if (!utils.isEmpty(employees)) {
      for (let i = 0; i < employees.length; i++) {
        employees[i] = employees[i].toString();
        if (!req.role.employees.includes(employees[i])) {
          return utils.logAndReturn(
            400,
            {
              success: false,
              msg: ErrorManager.createInvalidErrorMessage(
                `'${employees[i]}' employee`
              ),
            },
            req,
            res
          );
        }
      }
      employees = Array.from(new Set(employees));
    }

    Role.findById(req.params.id)
      .then((role) => {
        if (utils.isEmpty(role)) {
          return utils.logAndReturn(
            400,
            { success: false, msg: ErrorManager.roleDoesNotExist() },
            req,
            res
          );
        }

        for (let i = 0; i < employees.length; i++) {
          if (employees[i] === role.title) {
            return utils.logAndReturn(
              400,
              {
                success: false,
                msg: ErrorManager.createInvalidErrorMessage(
                  `'${employees[i]}' employee`
                ),
              },
              req,
              res
            );
          }
        }

        let current_title = role.title;

        if (!utils.isEmpty(title)) {
          role.title = title;
        }

        if (!utils.isEmpty(permissions)) {
          role.permissions = permissions;
        }

        if (!utils.isEmpty(employees)) {
          role.employees = employees;
        }

        role.dateModified = Date.now();
        role
          .save()
          .then((r) => {
            if (!utils.isEmpty(title)) {
              req.role.employees = req.role.employees.filter(
                (employee) => employee !== current_title
              );

              req.role.employees.push(title);
              req.role.employees = Array.from(new Set(req.role.employees));

              req.role.save().then().catch();
            }
            return utils.logAndReturn(
              200,
              {
                success: true,
                msg: SuccessManager.createEditedSuccessfully(
                  "The role has been"
                ),
              },
              req,
              res
            );
          })
          .catch((err) => {
            return utils.logAndReturn(
              400,
              { success: false, msg: ErrorManager.other() },
              req,
              res
            );
          });
      })
      .catch((err) => {
        return utils.logAndReturn(
          400,
          { success: false, msg: ErrorManager.roleDoesNotExist() },
          req,
          res
        );
      });
  }
);

// Delete Role
router.delete("/:id", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(req.admin, req.role.permissions, ROLE_MANAGEMENT, [
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
  Role.findByIdAndDelete(req.params.id)
    .then((role) => {
      if (utils.isEmpty(role)) {
        return utils.logAndReturn(
          400,
          { success: false, msg: ErrorManager.roleDoesNotExist() },
          req,
          res
        );
      }
      return utils.logAndReturn(
        200,
        {
          success: true,
          msg: SuccessManager.createDeletedSuccessfully("role"),
        },
        req,
        res
      );
    })
    .catch((err) => {
      return utils.logAndReturn(
        400,
        { success: false, msg: ErrorManager.roleDoesNotExist() },
        req,
        res
      );
    });
});

module.exports = router;
