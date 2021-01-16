const mongoose = require("mongoose");
//const validator = require("validator"); do we need it?

const requestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  sitterId: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
  accepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  declined: {
    type: Boolean,
    required: true,
    default: false,
  },
  paid: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
