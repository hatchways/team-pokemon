const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 6, // This check may not work if our password is salted + hashed prior to storing in database. The hashed password length may always be greater than 6 characters even if plain text password is less than 6. May need to update number depending on which hashing algorithm we use.
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
