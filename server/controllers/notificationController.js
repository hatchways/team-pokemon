const createError = require("http-errors");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

// Get list of requests for logged in user
exports.updateNotification = async (req, res, next) => {
  try {
    // Get current user's profile
    const user = await User.findById(req.user.id);
    const profile = await Profile.findById(user.profile);

    // Go through each unread request and mark as read
    for (let i = 0; i < profile.notifications.length; i++) {
      const notification = await Notification.findById(
        profile.notifications[i]._id
      );

      if (notification.read === false) {
        notification.read = true;
        await notification.save();
      }
    }
    const updatedProfile = await Profile.findById(user.profile).populate(
      "notifications"
    );

    res.status(200).send(updatedProfile);
  } catch (err) {
    next(createError(500, err.message));
  }
};
