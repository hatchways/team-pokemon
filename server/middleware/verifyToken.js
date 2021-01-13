const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(createError(401, "Access Denied!"));
    }

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    next(createError(401, "Invalid Token"));
  }
};
