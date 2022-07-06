const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title!"],
    },
    text: {
      type: String,
      required: [true, "Please provide some text!"],
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    commentaries: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true, // Adding createdAt and createdBy
  }
);

module.exports = mongoose.model("Post", PostSchema);
