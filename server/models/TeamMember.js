// server/models/TeamMember.js

const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Please add a title"],
  },
  imgSrc: {
    type: String, // We will store the URL to the image
    required: [true, "Please add an image source URL"],
  },
  // You can add social links later if you want
  // socialLinks: {
  //   discord: String,
  //   linkedin: String,
  //   facebook: String
  // }
});

module.exports = mongoose.model("TeamMember", TeamMemberSchema);
