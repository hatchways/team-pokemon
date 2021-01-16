const mongoose = require("mongoose");
const validator = require("validator");

const profileSchema = new mongoose.Schema({
  isSitter: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: [true, "Please provide your first name."],
    validate: [validator.isAlpha, "First name must only contain characters."],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name."],
    validate: [validator.isAlpha, "Last name must only contain characters."],
  },
  gender: {
    type: String,
    validate: [validator.isAlpha, "Gender must only contain characters."],
  },
  birthDate: {
    type: Date,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
