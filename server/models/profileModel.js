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
    validate: function (val) {
      return validator.isAlpha(
        val,
        ["en-GB"],
        {
          ignore: " -",
        },
        "First name must only contain characters, dash and/or space"
      );
    },
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name."],
    validate: function (val) {
      return validator.isAlpha(
        val,
        ["en-GB"],
        {
          ignore: " -",
        },
        "Last name must only contain characters, dash and/or space"
      );
    },
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
    default: "",
  },
  profilePicture: {
    type: String,
  },
  availability: [
    {
      start: Date,
      end: Date,
    },
  ],
  headerPicture: {
    type: String,
  },
  photoAlbum: [{ type: String }],
  price: {
    type: Number,
    default: 14.0,
  },
  notifications: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
