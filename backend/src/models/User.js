const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["researcher", "investor", "admin"],
      default: "researcher",
    },
    institution: { type: String },
    googleScholar: { type: String },
    scopusLink: { type: String },
    phoneNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
