const createError = require("http-errors");
const Profile = require("../models/profileModel");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinaryUpload = require("../middleware/cloudinaryUpload");
const User = require("../models/userModel");
const base64url = require("base64url");

/**
 * CREATE /profile
 * - Given parameters passed in, create a profile.
 */
exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, gender, birthDate, description } = req.body;
    //check for first and last name
    if (!firstName) {
      return next(createError(400, "First name required!"));
    }
    if (!lastName) {
      return next(createError(400, "Last name required!"));
    }

    //create new profile
    const newProfile = new Profile({
      firstName,
      lastName,
      gender,
      birthDate,
      description,
    });
    const savedProfile = await newProfile.save();

    res.status(200).send(savedProfile);
  } catch (err) {
    next(createError(500, err.message));
  }
};
/**
 * UPDATE /profile/:id
 * - Given an ID and new parameters, update the profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // Add check if profile belongs to current user

    //check if ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid Profile id!"));
    }

    const {
      isSitter,
      firstName,
      lastName,
      gender,
      birthDate,
      email,
      phoneNumber,
      address,
      description,
    } = req.body;

    const profileFields = {};

    if (isSitter) profileFields.isSitter = isSitter;
    if (firstName) profileFields.firstName = firstName;
    if (lastName) profileFields.lastName = lastName;
    if (gender) profileFields.gender = gender;
    if (birthDate) profileFields.birthDate = birthDate;
    if (phoneNumber) profileFields.phoneNumber = phoneNumber;
    if (address) profileFields.address = address;
    if (description) profileFields.description = description;

    // retrieve user and update email field
    const user = await User.findById(req.user.id);

    user.email = email;

    const updatedUser = await user.save();

    //retrieve profile and update necessary fields
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { new: true }
    );

    if (!updatedProfile) {
      return next(createError(404, "Update Failed! Profile does not exist!"));
    }
    res.status(200).send({ profile: updatedProfile, user: updatedUser });
  } catch (err) {
    next(createError(500, err.message));
  }
};

/**
 * GET /profile/:id
 * - Given an ID, return profile with that ID
 */
exports.getProfile = async (req, res, next) => {
  try {
    //check if ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid Profile id!"));
    }
    //retrieve user by id
    const user = await User.findById(req.params.id).populate("profile");
    if (!user) {
      return next(createError(404, "Profile does not exist!"));
    }
    res.status(200).send(user.profile);
  } catch (err) {
    console.log(err.message);
    next(createError(500, err.message));
  }
};

/**
 * GET /profile
 * - A list of profiles
 */
exports.getProfileList = async (req, res, next) => {
  try {
    const profileList = await Profile.find({
      _id: { $ne: req.params.id },
      isSitter: true,
    });
    res.status(200).send(profileList);
  } catch (err) {
    next(createError(500, err.message));
  }
};

/**
 * upload images for profile
 * - takes image file and uploads it to cloudinary.
 */
exports.upload = async (req, res, next) => {
  try {
    //check if ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid Profile id!"));
    }
    const userExist = await Profile.exists({ _id: req.params.id });
    if (!userExist) {
      // check if profile exists.
      return next(createError(404, "Profile does not exist!"));
    }
    const file = req.files.file; // extract image from post request
    //return error if image not included in request
    if (!file) {
      return next(createError(400, "Please include image"));
    }
    const profile = await Profile.findById(req.params.id);

    // User can only have a max of 5 images.
    if (profile.photoAlbum.length >= 5) {
      return next(createError(400, "You can not upload more than 5 images!"));
    }

    const result = await cloudinaryUpload.upload(file.tempFilePath);

    // Add new photo url to photoAlbum
    profile.photoAlbum.push(result.url);

    await profile.save();

    res.status(200).json({ message: "Image uploaded!", url: result.url });
  } catch (err) {
    next(createError(500, err.message));
  }
};

/**
 * set profile photo categories (i.e. profile photo, header photo)
 */
exports.setPhotoCategory = async (req, res, next) => {
  try {
    //check if ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid Profile id!"));
    }
    const userExist = await Profile.exists({ _id: req.params.id });
    if (!userExist) {
      // check if profile exists.
      return next(createError(404, "Profile does not exist!"));
    }
    const { photoUrl, category } = req.body; // extract image from post request

    //return error if image not included in request
    if (!photoUrl) {
      return next(createError(400, "Please include image"));
    }

    let updatedProfile;
    // update profile pic with new url
    if (category === "profile") {
      updatedProfile = await Profile.findOneAndUpdate(
        { _id: req.params.id },
        { profilePicture: photoUrl },
        { new: true }
      );
    }

    if (category === "header") {
      updatedProfile = await Profile.findOneAndUpdate(
        { _id: req.params.id },
        { headerPicture: photoUrl },
        { new: true }
      );
    }
    res.status(200).send(updatedProfile);
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.deletePicture = async (req, res, next) => {
  try {
    //check if ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid Profile id!"));
    }

    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      // check if profile exists.
      return next(createError(404, "Profile does not exist!"));
    }

    const photoUrl = base64url.decode(req.params.photoUrl);

    // update profile (delete photo)
    profile.photoAlbum.pull(photoUrl);

    // If photo is profile picture, remove profile picture
    if (profile.profilePicture === photoUrl) {
      profile.profilePicture = "";
    }

    // If photo is header picture, remove header picture
    if (profile.headerPicture === photoUrl) {
      profile.headerPicture = "";
    }

    const updatedProfile = await profile.save();

    res.status(200).send(updatedProfile);
  } catch (err) {
    console.log(err.message);
    next(createError(500, err.message));
  }
};
