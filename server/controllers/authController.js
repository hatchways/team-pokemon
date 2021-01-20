const createError = require("http-errors");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/validation");

// HELPER FUNCTIONS

const signToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "5h",
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 5, // 5 hours
    httpOnly: true,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// AUTH CONTROLLERS

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    // Validate data before creating new user
    const { error } = registerValidation({
      email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      return next(createError(400, error.details[0].message));
    }

    // Check if user already exists
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return next(createError(400, "Email already exists!"));
    }

    // Create salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new profile and save to database
    const newProfile = new Profile({
      firstName,
      lastName,
    });

    const savedProfile = await newProfile.save();

    // Create new user and save to database
    const newUser = new User({
      email,
      password: hashedPassword,
      profile: savedProfile,
    });

    const savedUser = await newUser.save();

    // Create JWT and store in cookie
    createSendToken(savedUser, 201, req, res);
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.login = async (req, res, next) => {
  try {
    // Validate data
    const { error } = loginValidation(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { email, password } = req.body;

    // Check if email exists, select password if it does.
    const user = await User.findOne({ email: email })
      .select(["email", "password", "profile"])
      .populate("profile");

    if (!user) {
      return next(createError(400, "Invalid email or password!"));
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(createError(400, "Invalid email or password!"));
    }

    createSendToken(user, 201, req, res);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Logout User
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: "success" });
};
