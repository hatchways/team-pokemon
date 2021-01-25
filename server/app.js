const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileupload = require("express-fileupload");

const indexRouter = require("./routes/index");
const pingRouter = require("./routes/ping");
const userRouter = require("./routes/userRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const paymentRouter = require("./routes/paymentRouter");

const connectDB = require("./database");

const { json, urlencoded } = express;

var app = express();

connectDB();
/////
// app.use(function (req, res, next) {
//   res.setHeader(
//     "Content-Security-Policy",
//     "connect-src 'self' https://api.stripe.com https:; frame-src https://js.stripe.com https://hooks.stripe.com https:; script-src 'self'  https://js.stripe.com 'sha256-QAj9SgqS0tkqFXsMg6gbHzN3KfNnrPW0N0FCdMzN3MI=' https:"
//   );
//   next();
// });
/////
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(
  fileupload({
    useTempFiles: true,
  })
);

app.use("/", indexRouter);
app.use("/ping", pingRouter);
app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", requestRouter);
app.use("/api/payment", paymentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
