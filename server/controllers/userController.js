const createError = require("http-errors");

const User = require("../models/userModel");

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("profile");
    if (!user) {
      return next(createError(404, "User not found."));
    }
    res.status(201).json(user);
  } catch (err) {
    next(createError(500, "Server error."));
  }
};
