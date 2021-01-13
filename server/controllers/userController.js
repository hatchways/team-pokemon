const createError = require("http-errors");

const User = require("../../models/User");

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      next(createError(404, "User not found."));
    }

    res.status(201).json(user);
  } catch (err) {
    next(createError(500, "Server error."));
  }
};
