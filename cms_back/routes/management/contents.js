const mongoose = require("mongoose");
const router = require("express").Router();
const path = require("path");

require("dotenv").config();

// Models
const Content = mongoose.model("Content");

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
const { VERIFIED, ENABLED, CONTENT_MANAGEMENT } = require(path.join(
  __dirname,
  "../../constants"
));

// Validations
const { validateRequests } = require(path.join(
  __dirname,
  "../../components/validation"
));

/* Content Mangement */

// get all content
router.get("/", async (req, res, next) => {
  Content.find()
    .then((contents) => {
      return res.status(200).json({ success: true, contents });
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
});

// get content by id
router.get("/:id", async (req, res, next) => {
  Content.findById(req.params.id)
    .then((content) => {
      if (utils.isEmpty(content)) {
        return res
          .status(404)
          .json({ success: false, msg: ErrorManager.notFound() });
      }

      return res.status(200).json({ success: true, content });
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
});

// Add content
router.post("/add", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(
      req.admin,
      req.role.permissions,
      CONTENT_MANAGEMENT,
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
      title: "contents",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("contents"),
      },
      error: ErrorManager.createInvalidErrorMessage("contents"),
    },
    {
      title: "name",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("name"),
      },
      error: ErrorManager.createInvalidErrorMessage("name"),
    },
  ];
  let { isValid, errors } = validateRequests(req.body, validationOptions);

  if (!isValid) {
    return utils.logAndReturn(400, { success: false, errors }, req, res);
  }

  const { contents, name } = req.body;

  if (!Array.isArray(contents)) {
    return utils.logAndReturn(
      400,
      {
        success: false,
        msg: ErrorManager.createInvalidErrorMessage("Inputs", true),
      },
      req,
      res
    );
  }

  for (let i = 0; i < contents.length; i++) {
    if (
      utils.isEmpty(contents[i].title) &&
      utils.isEmpty(contents[i].detail) &&
      utils.isEmpty(contents[i].link) &&
      utils.isEmpty(contents[i].images)
    ) {
      return utils.logAndReturn(
        400,
        {
          success: false,
          msg: ErrorManager.createInvalidErrorMessage("Inputs", true),
        },
        req,
        res
      );
    }
    if (
      !utils.isEmpty(contents[i].images) &&
      !Array.isArray(contents[i].images)
    ) {
      return utils.logAndReturn(
        400,
        {
          success: false,
          msg: ErrorManager.createInvalidErrorMessage("Inputs", true),
        },
        req,
        res
      );
    }
  }

  Content.findOne({ name: name })
    .then((content) => {
      if (!utils.isEmpty(content)) {
        return utils.logAndReturn(
          409,
          {
            success: false,
            msg: ErrorManager.contentAlreadyExists(),
          },
          req,
          res
        );
      }

      const newContent = new Content({
        contents: contents,
        name: name,
      });

      newContent
        .save()
        .then((savedContent) => {
          return utils.logAndReturn(
            200,
            {
              success: true,
              msg: SuccessManager.createAddedSuccessfully("The content"),
              content: savedContent,
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
          msg: ErrorManager.other(),
        },
        req,
        res
      );
    });
});

// edit content
router.post("/edit/:id", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(
      req.admin,
      req.role.permissions,
      CONTENT_MANAGEMENT,
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
      title: "contents",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("contents"),
      },
      error: ErrorManager.createInvalidErrorMessage("contents"),
    },
  ];
  let { isValid, errors } = validateRequests(req.body, validationOptions);

  if (!isValid) {
    return utils.logAndReturn(400, { success: false, errors }, req, res);
  }

  let { contents, name } = req.body;

  if (!Array.isArray(contents)) {
    return utils.logAndReturn(
      400,
      {
        success: false,
        msg: ErrorManager.createInvalidErrorMessage("Inputs", true),
      },
      req,
      res
    );
  }

  for (let i = 0; i < contents.length; i++) {
    if (
      utils.isEmpty(contents[i].title) &&
      utils.isEmpty(contents[i].detail) &&
      utils.isEmpty(contents[i].link) &&
      utils.isEmpty(contents[i].images)
    ) {
      return utils.logAndReturn(
        400,
        {
          success: false,
          msg: ErrorManager.createInvalidErrorMessage("Inputs", true),
        },
        req,
        res
      );
    }
    if (
      !utils.isEmpty(contents[i].images) &&
      !Array.isArray(contents[i].images)
    ) {
      return utils.logAndReturn(
        400,
        {
          success: false,
          msg: ErrorManager.createInvalidErrorMessage("Inputs", true),
        },
        req,
        res
      );
    }
  }

  Content.findById(req.params.id)
    .then((content) => {
      if (utils.isEmpty(content)) {
        return utils.logAndReturn(
          404,
          {
            success: false,
            msg: ErrorManager.notFound(),
          },
          req,
          res
        );
      }

      content.contents = contents;
      content.dateModified = Date.now();

      content
        .save()
        .then((savedContent) => {
          return utils.logAndReturn(
            200,
            {
              success: true,
              msg: SuccessManager.createEditedSuccessfully("The content"),
              content: savedContent,
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
          msg: ErrorManager.other(),
        },
        req,
        res
      );
    });
});

// Delete content
router.delete("/:id", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(
      req.admin,
      req.role.permissions,
      CONTENT_MANAGEMENT,
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

  Content.findById(req.params.id)
    .then((content) => {
      if (utils.isEmpty(content)) {
        return utils.logAndReturn(
          404,
          {
            success: false,
            msg: ErrorManager.notFound(),
          },
          req,
          res
        );
      }

      content
        .delete()
        .then((deletedContent) => {
          return utils.logAndReturn(
            200,
            {
              success: true,
              msg: SuccessManager.createDeletedSuccessfully("The content"),
              content: deletedContent,
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
          msg: ErrorManager.other(),
        },
        req,
        res
      );
    });
});

module.exports = router;
