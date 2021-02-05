const createError = require("http-errors");
const Profile = require("../models/profileModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// Create notification
exports.sendNotification = async (receiver, message) => {
  try {
    // Create a new notification and save to database
    const newNotification = new Notification({
      message,
    });

    const savedNotification = await newNotification.save();

    // Find receiver's profile and update notifications array
    const receiverUser = await User.findById(receiver).select("profile");
    const receiverProfile = await Profile.findById(receiverUser.profile);

    receiverProfile.notifications.unshift(savedNotification._id);

    await receiverProfile.save();
  } catch (err) {
    console.log(err.message);
  }
};
