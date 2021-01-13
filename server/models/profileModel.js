const mongoose = require("mongoose");
const validator = require("validator");

const profileSchema = new mongoose.Schema({
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
          validate: [validator.isAlpha, "gender must only contain characters."],
      },
      birthDate: {
          type: Date,
      },
      description: {
          type: String,
          validate: [validator.isAlpha, "description must contain only characters"]
      }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;