const path = require("path");
const { successMessages } = require(path.join(__dirname, "../constants"));

class SuccessManager {
  static createAddedSuccessfully = (title) => {
    return `${title} added successfully.`;
  };

  static createEditedSuccessfully = (title) => {
    return `${title} edited successfully.`;
  };

  static createDeletedSuccessfully = (title) => {
    return `${title} deleted successfully.`;
  };

  static accountCreatedSuccessfully = () => {
    return successMessages.accountCreatedSuccessfully;
  };

  static accountCompleted = () => {
    return successMessages.accountCompleted;
  };

  static verifiedSuccessfully = () => {
    return successMessages.verifiedSuccessfully;
  };

  static roleSuccessfullyAdded = () => {
    return successMessages.roleSuccessfullyAdded;
  };

  static passwordChangedSuccessfully = () => {
    return successMessages.passwordChangedSuccessfully;
  };

  static passwordResetLinkSent = () => {
    return successMessages.passwordResetLinkSent;
  };

  static filesUploaded = () => {
    return successMessages.filesUploaded;
  };
}

module.exports = SuccessManager;
