const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");

require("dotenv").config();

// Middlewares
const auth = require(path.join(
  __dirname,
  "../../../middlewares/authentication/auth"
));
const getAdmin = require(path.join(
  __dirname,
  "../../../middlewares/authentication/getAdmin"
));
const getRole = require(path.join(
  __dirname,
  "../../../middlewares/authentication/getRole"
));
const filesPayloadExists = require(path.join(
  __dirname,
  "../../../middlewares/upload/filesPayloadExists"
));
const fileExtLimiter = require(path.join(
  __dirname,
  "../../../middlewares/upload/fileExtLimiter"
));
const fileSizeLimiter = require(path.join(
  __dirname,
  "../../../middlewares/upload/fileSizeLimiter"
));

const writeFiles = require(path.join(
  __dirname,
  "../../../middlewares/upload/writeFiles"
));

// helper functions
const utils = require(path.join(__dirname, "../../../lib/utils"));

// Error Manager
const ErrorManager = require(path.join(__dirname, "../../../lib/ErrorManager"));

// Success Manager
const SuccessManager = require(path.join(
  __dirname,
  "../../../lib/SuccessManager"
));

// Constants
const {
  VERIFIED,
  ENABLED,
  IMAGE_ALLOWED_EXT,
  FILE_MANAGEMENT,
  UPLOAD_PATH,
  CONTENT_IMAGE_SUB_PATH,
} = require(path.join(__dirname, "../../../constants"));

// Verification Templates

// Validations
const { validateRequests } = require(path.join(
  __dirname,
  "../../../components/validation"
));

/* Images */

// get all images
router.get("/", auth, getAdmin, async (req, res, next) => {
  const images_path = path.join(
    __dirname,
    "../../..",
    UPLOAD_PATH,
    CONTENT_IMAGE_SUB_PATH
  );

  fs.readdir(images_path, function (err, files) {
    //handling error
    if (!utils.isEmpty(err)) {
      return utils.logAndReturn(
        400,
        {
          success: false,
          msg: err,
        },
        req,
        res
      );
    } else {
      files = files.map((fileName) => ({
        name: fileName,
        dateCreated: fs.statSync(`${images_path}/${fileName}`).atime,
        dateModified: fs.statSync(`${images_path}/${fileName}`).mtime,
      }));
      return utils.logAndReturn(
        200,
        {
          success: true,
          images: files,
        },
        req,
        res
      );
    }
  });
});

// Add an image
router.post(
  "/add",
  auth,
  getAdmin,
  getRole,
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(IMAGE_ALLOWED_EXT),
  fileSizeLimiter,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        FILE_MANAGEMENT,
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

    try {
      // Set setName
      Object.keys(req.files).forEach((key) => {
        let ext = path.extname(req.files[key].name);
        req.files[key] = {
          ...req.files[key],
          setName: key + ext,
        };
      });

      next();
    } catch (err) {
      return utils.logAndReturn(
        400,
        { success: false, msg: ErrorManager.other() },
        req,
        res
      );
    }
  },
  writeFiles(CONTENT_IMAGE_SUB_PATH, SuccessManager.filesUploaded())
);

// Edit an image
router.post("/edit", auth, getAdmin, getRole, async (req, res, next) => {
  if (
    !utils.checkCredibility(req.admin, req.role.permissions, FILE_MANAGEMENT, [
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

  const validationOptions = [
    {
      title: "previous_name",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("previous_name"),
      },
      error: ErrorManager.createInvalidErrorMessage("previous_name"),
    },
    {
      title: "new_name",
      type: "text",
      required: {
        value: true,
        error: ErrorManager.createRequirementErrorMessage("new_name"),
      },
      error: ErrorManager.createInvalidErrorMessage("new_name"),
    },
  ];
  let { isValid, errors } = validateRequests(req.body, validationOptions);

  if (!isValid) {
    return utils.logAndReturn(400, { success: false, errors }, req, res);
  }

  let { previous_name, new_name } = req.body;

  let previous_ext = path.extname(previous_name);
  let new_ext = path.extname(new_name);
  if (utils.isEmpty(previous_ext)) {
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

  if (utils.isEmpty(new_ext)) {
    new_name += previous_ext;
  } else {
    new_name = path.parse(new_name).name + previous_ext;
  }

  const previous_path = path.join(
    __dirname,
    "../../..",
    UPLOAD_PATH,
    CONTENT_IMAGE_SUB_PATH,
    previous_name
  );

  const new_path = path.join(
    __dirname,
    "../../..",
    UPLOAD_PATH,
    CONTENT_IMAGE_SUB_PATH,
    new_name
  );

  try {
    if (fs.existsSync(previous_path)) {
      fs.rename(previous_path, new_path, (err) => {
        if (!utils.isEmpty(err)) {
          return utils.logAndReturn(
            400,
            {
              success: false,
              msg: ErrorManager.other(),
            },
            req,
            res
          );
        }
      });
      return utils.logAndReturn(
        200,
        {
          success: true,
          msg: SuccessManager.createEditedSuccessfully("The image"),
        },
        req,
        res
      );
    }
    return utils.logAndReturn(
      400,
      {
        success: false,
        msg: ErrorManager.notFound(),
      },
      req,
      res
    );
  } catch (err) {
    return utils.logAndReturn(
      400,
      {
        success: false,
        msg: ErrorManager.other(),
      },
      req,
      res
    );
  }
});

// delete an image
router.delete(
  "/:image_name",
  auth,
  getAdmin,
  getRole,
  async (req, res, next) => {
    if (
      !utils.checkCredibility(
        req.admin,
        req.role.permissions,
        FILE_MANAGEMENT,
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
        title: "image_name",
        type: "text",
        required: {
          value: true,
          error: ErrorManager.createRequirementErrorMessage("image_name"),
        },
        error: ErrorManager.createInvalidErrorMessage("image_name"),
      },
    ];
    let { isValid, errors } = validateRequests(req.params, validationOptions);
    if (!isValid) {
      return utils.logAndReturn(400, { success: false, errors }, req, res);
    }
    let { image_name } = req.params;
    const image_path = path.join(
      __dirname,
      "../../..",
      UPLOAD_PATH,
      CONTENT_IMAGE_SUB_PATH,
      image_name
    );
    try {
      if (fs.existsSync(image_path)) {
        fs.unlinkSync(image_path);
        return utils.logAndReturn(
          200,
          {
            success: false,
            msg: SuccessManager.createDeletedSuccessfully("The image"),
          },
          req,
          res
        );
      } else {
        return utils.logAndReturn(
          400,
          {
            success: false,
            msg: ErrorManager.notFound(),
          },
          req,
          res
        );
      }
    } catch (err) {
      return utils.logAndReturn(
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
);

module.exports = router;
