const path = require("path");
const mongoose = require("mongoose");

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../lib/ErrorManager"));

// Helper functions
const { isEmpty, logAndReturn } = require(path.join(
  __dirname,
  "../../lib/utils"
));

//Models
const Role = mongoose.model("Role");

const updateEmployees = async (req, res, next) => {
  if (isEmpty(req.role)) {
    return next();
  }
  let newEmployees = [];
  let validRoles = [];
  if (!isEmpty(req.roles)) {
    validRoles = req.roles.map((role) => role.title);
  } else {
    let roleRes = await Role.find()
      .then((roles) => {
        validRoles = roles.map((role) => role.title);
      })
      .catch((err) => {
        return err;
      });
    if (!isEmpty(roleRes)) {
      return logAndReturn(
        400,
        {
          success: false,
          msg: ErrorManager.other(),
        },
        req,
        res
      );
    }
  }

  req.role.employees.forEach((employee) => {
    if (validRoles.includes(employee)) {
      newEmployees.push(employee);
    }
  });
  if (newEmployees != req.role.employees) {
    req.role.employees = newEmployees;
    req.role
      .save()
      .then((role) => {
        req.role = role;
        return next();
      })
      .catch((err) => {
        return logAndReturn(
          400,
          {
            success: false,
            msg: ErrorManager.other(),
          },
          req,
          res
        );
      });
  } else {
    return next();
  }
};

module.exports = updateEmployees;
