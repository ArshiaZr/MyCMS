// Permissions
// const FINANCIAL_MANAGEMENT = "financial-management";
// const STORE_MANAGEMENT = "store-management";
// const PRODUCTS_MANAGEMENT = "products-management";
// const WEB_ANALYTICS = "web-analytics";
// const CUSTOMER_MANAGEMENT = "customer-management";
const CONTENT_MANAGEMENT = "content-management";
const EMPLOYEES_MANAGEMENT = "employees-management";
const ADMIN_MANAGEMENT = "admin-management";
const ROLE_MANAGEMENT = "role-management";
const LOG_MANAGEMENT = "log-management";
const FILE_MANAGEMENT = "file-management";

const ALLPERMISSIONS = [
  // FINANCIAL_MANAGEMENT,
  // STORE_MANAGEMENT,
  // PRODUCTS_MANAGEMENT,
  // WEB_ANALYTICS,
  // CUSTOMER_MANAGEMENT,
  CONTENT_MANAGEMENT,
  EMPLOYEES_MANAGEMENT,
  ADMIN_MANAGEMENT,
  ROLE_MANAGEMENT,
  LOG_MANAGEMENT,
];

// Upload
const FILES_SIZE_LIMIT_MB = 5;
const IMAGE_ALLOWED_EXT = [".png", ".jpg", ".jpeg", ".webp", ".PNG", ".JPG"];
const VIDEO_ALLOWED_EXT = [".mp4"];
const AUDIO_ALLOWED_EXT = [".mp3"];
const DOCUMENT_ALLOWED_EXT = [".pdf"];

// Errors
const errorMessages = {
  authFailed: "Authentication has been failed.",
  wrongUserPass: "Wrong username/password.",
  accessDenied: "You don't have the right permission to accesss this route.",
  accountExists: "The account already exists.",
  accountDoesNotExist: "No account found.",
  accountAlreadyComplete:
    "The account information is already filled. If you need to change any information, you have to contact the administrator.",
  verificationNotMatch:
    "There is no account match with this verification code.",
  accountAlreadyVerified: "The account is already verified.",
  other: "Something went wrong contact the administrator.",
  notFound: "Not found.",
  missingFile: "Missing file.",
  roleAlreadyExists: "The role already exists.",
  rolesInvalid: "Roles are invalid",
  inputsAlreadySet: "The inputs are equal to the variables in database",
  roleDoesNotExist: "Role does not exists.",
  filesShouldHaveDifferentNames: "Files should have different names",
  passwordChange:
    "You requested to change your password before. You have to complete the changing process first.",
  atLeastOneIsRequired: "At least one of the inputs is required.",
  contentAlreadyExists:
    "A content with this name already exists. Choose another name.",
  fileAlreadyExists: "The file already exists.",
};

// Successes
const successMessages = {
  accountCompleted:
    "Your account is complete now. We just sent you an email with verification url.",
  verifiedSuccessfully: "Your account verified successfully.",
  roleSuccessfullyAdded: "The role has been successfully added.",
  passwordChangedSuccessfully: "Password changed successfully.",
  passwordResetLinkSent: "Password reset has been sent to your email.",
  accountCreatedSuccessfully: "Account has been created successfully",
  filesUploaded: "Files have been uploaded successfully.",
};

// Paths
const UPLOAD_PATH = "/uploads";

// Sub Paths
const ADMIN_PROFILE_IMAGE_SUB_PATH = "/admins/images";
const CONTENT_IMAGE_SUB_PATH = "/contents/images";

// Module Exports
module.exports.UPLOAD_PATH = UPLOAD_PATH;
module.exports.ADMIN_PROFILE_IMAGE_SUB_PATH = ADMIN_PROFILE_IMAGE_SUB_PATH;
module.exports.CONTENT_IMAGE_SUB_PATH = CONTENT_IMAGE_SUB_PATH;

module.exports.VERIFIED = "verified";
module.exports.ENABLED = "enabled";

// module.exports.FINANCIAL_MANAGEMENT = FINANCIAL_MANAGEMENT;
// module.exports.STORE_MANAGEMENT = STORE_MANAGEMENT;
// module.exports.PRODUCTS_MANAGEMENT = PRODUCTS_MANAGEMENT;
// module.exports.WEB_ANALYTICS = WEB_ANALYTICS;
// module.exports.CUSTOMER_MANAGEMENT = CUSTOMER_MANAGEMENT;
module.exports.CONTENT_MANAGEMENT = CONTENT_MANAGEMENT;
module.exports.EMPLOYEES_MANAGEMENT = EMPLOYEES_MANAGEMENT;
module.exports.ADMIN_MANAGEMENT = ADMIN_MANAGEMENT;
module.exports.ROLE_MANAGEMENT = ROLE_MANAGEMENT;
module.exports.LOG_MANAGEMENT = LOG_MANAGEMENT;
module.exports.FILE_MANAGEMENT = FILE_MANAGEMENT;

module.exports.errorMessages = errorMessages;
module.exports.successMessages = successMessages;
module.exports.ALLPERMISSIONS = ALLPERMISSIONS;

module.exports.FILES_SIZE_LIMIT_MB = FILES_SIZE_LIMIT_MB;

module.exports.IMAGE_ALLOWED_EXT = IMAGE_ALLOWED_EXT;
module.exports.VIDEO_ALLOWED_EXT = VIDEO_ALLOWED_EXT;
module.exports.AUDIO_ALLOWED_EXT = AUDIO_ALLOWED_EXT;
module.exports.DOCUMENT_ALLOWED_EXT = DOCUMENT_ALLOWED_EXT;
