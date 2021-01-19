const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    index: true,
    required: true,
  },
  sitterId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    index: true,
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
    default: false,
  },
  declined: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
