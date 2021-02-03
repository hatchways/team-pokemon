const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  content: {
    type: String,
  },
  timeCreated: {
    type: Date,
  },
  wasRead: {
    type: Boolean,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
