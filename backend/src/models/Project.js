const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: String,
    abstract: String,
    trl: Number,
    ipStatus: String,
    fundingRequired: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    interestedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
