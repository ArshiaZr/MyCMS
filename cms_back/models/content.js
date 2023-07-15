const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  contents: [
    {
      order: {
        type: Number,
        default: 0,
      },
      title: {
        type: String,
        default: "",
      },
      detail: {
        type: String,
        default: "",
      },
      images: [
        {
          order: {
            type: Number,
            default: 0,
          },
          title: {
            type: String,
            default: "",
          },
          detail: {
            type: String,
            default: "",
          },
          image: {
            type: String,
            default: "",
          },
        },
      ],
      link: {
        type: String,
        default: "",
      },
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  dateModified: {
    type: Date,
    default: Date.now(),
  },
});

mongoose.model("Content", ContentSchema);
