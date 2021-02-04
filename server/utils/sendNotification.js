const createError = require("http-errors");
const Profile = require("../models/profileModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Create notification
exports.sendNotification = async (sender, receiver) => {
  try {
    const message = "firstName lastName has sent you a request!";

    // Create a new notification and save to database
    const newNotification = new Notification({
      message,
    });

    const savedNotification = await newNotification.save();

    // Find receiver's profile and update notifications array
    const receiverUser = await User.findById(receiver).select("profile");
    const receiverProfile = await Profile.findOneAndUpdate(
      { _id: receiverUser.profile },
      { $push: { notifications: savedNotification._id } },
      { new: true }
    );

    // Emit the notification
    // socket.emit("newNotification", savedNotification);
  } catch (err) {
    console.log(err.message);
  }
};
