const createError = require("http-errors");
const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

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
    //retrieve profile by id
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return next(createError(404, "Profile does not exist!"));
    }
    res.status(200).send(profile);
  } catch (err) {
    next(createError(500, err.message));
  }
};
/**
 * GET /profile
 * - A list of profiles
 */
exports.getProfileList = async (req, res, next) => {
  try {
    const profileList = await Profile.find();
    res.status(200).send(profileList);
  } catch (err) {
    next(createError(500, err.message));
  }
};
