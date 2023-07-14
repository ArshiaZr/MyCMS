const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  dateModified: {
    type: Date,
  },
  permissions: {
    type: [String],
    default: [],
  },
  employees: {
    type: [String],
    default: [],
  },
});

mongoose.model("Role", RoleSchema);
