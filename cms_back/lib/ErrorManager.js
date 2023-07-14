const path = require("path");
const { errorMessages } = require(path.join(__dirname, "../constants"));

class ErrorManager {
  static createLengthErrorMessage = (title, from, to) => {
    return `The ${title} should contain ${from} to ${to} characters`;
  };

  static createRequirementErrorMessage = (title) => {
    return `The ${title} is required`;
  };

  static createInvalidErrorMessage = (title, plural = false) => {
    if (plural) {
      return `${title} are invalid.`;
    }
    return `${title} is invalid.`;
  };

  static createUploadAmountLimit = (amount) => {
    return `The upload amount should not exceed ${amount}.`;
  };

  static createFileExtLimit = (allowedExtArray) => {
    return `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
      ",",
      ", "
    );
  };

  static createFileSizeLimit = (mb_size, filesOverLimit) => {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";

    const sentence =
      `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${mb_size} MB.`.replaceAll(
        ",",
        ", "
      );

    return filesOverLimit.length < 3
      ? sentence.replace(",", " and")
      : sentence.replace(/,(?=[^,]*$)/, " and");
  };

  static atLeastOneIsRequired = () => {
    return errorMessages.atLeastOneIsRequired;
  };

  static passwordChange() {
    return errorMessages.passwordChange;
  }

  static filesShouldHaveDifferentNames = () => {
    return errorMessages.filesShouldHaveDifferentNames;
  };

  static inputsAlreadySet = () => {
    return errorMessages.inputsAlreadySet;
  };

  static authFailed = () => {
    return errorMessages.authFailed;
  };

  static wrongUserPass = () => {
    return errorMessages.wrongUserPass;
  };

  static accessDenied = () => {
    return errorMessages.accessDenied;
  };

  static accountExists = () => {
    return errorMessages.accountExists;
  };

  static roleAlreadyExists = () => {
    return errorMessages.roleAlreadyExists;
  };

  static roleDoesNotExist = () => {
    return errorMessages.roleDoesNotExist;
  };

  static rolesInvalid = () => {
    return errorMessages.rolesInvalid;
  };

  static accountDoesNotExist = () => {
    return errorMessages.accountDoesNotExist;
  };

  static accountAlreadyComplete = () => {
    return errorMessages.accountAlreadyComplete;
  };

  static verificationNotMatch = () => {
    return errorMessages.verificationNotMatch;
  };

  static accountAlreadyVerified = () => {
    return errorMessages.accountAlreadyVerified;
  };

  static other = () => {
    return errorMessages.other;
  };

  static notFound = () => {
    return errorMessages.notFound;
  };

  static missingFile = () => {
    return errorMessages.missingFile;
  };

  static contentAlreadyExists = () => {
    return errorMessages.contentAlreadyExists;
  };

  static fileAlreadyExists = () => {
    return errorMessages.fileAlreadyExists;
  };
}

module.exports = ErrorManager;
