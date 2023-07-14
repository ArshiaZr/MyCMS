const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    default: "",
    required: false,
  },
  lastname: {
    type: String,
    default: "",
    required: false,
  },
  phonenumber: {
    type: String,
    default: "",
    required: false,
  },
  email: {
    type: String,
    default: "",
    required: false,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "",
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
  },
  dateModified: {
    type: Date,
  },
  isPasswordChanging: {
    type: Boolean,
    default: false,
  },
});

mongoose.model("Admin", AdminSchema);
