// server/models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // ... email and password fields remain the same
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "aadi@aadi.com",
    ],
  },
  password: {
    type: String,
    required: [true, "Sajal1234"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["client", "user"], // Defines possible roles
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
