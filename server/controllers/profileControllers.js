const createError = require("http-errors");
const Profile = require("../models/profileModel");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinaryUpload = require("../middleware/cloudinaryUpload");
const User = require("../models/userModel");

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
 * upload image for profile
 * - takes image file and uploads it to cloudinary. Updates profile picture
 *   with new url returned from cloudinary.
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

    const result = await cloudinaryUpload.upload(file.tempFilePath);
    //update profile pic with new url
    await Profile.findOneAndUpdate(
      { _id: req.params.id },
      { profilePicture: result.url },
      { new: true }
    );
    res.status(200).json({ message: "Image updated!", url: result.url });
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
    const userExist = await Profile.exists({ _id: req.params.id });
    if (!userExist) {
      // check if profile exists.
      return next(createError(404, "Profile does not exist!"));
    }
    //update profile (delete profilePicture field)
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $unset: { profilePicture: "" } }
    );
    res.status(200).send("Image deleted!");
  } catch (err) {
    next(createError(500, err.message));
  }
};
exports.addAvailability = async (req, res, next) => {
  try{
    //check request ID
    if(!ObjectId.isValid(req.params.id)){
      return next(createError(400, "Invalid Profile id!"));
    }

    const profile = await Profile.findOne({ _id: req.params.id });
    if (!profile) {
      // check if profile exists.
      return next(createError(404, "Profile does not exist!"));
    }
    //extract start and end date from body if profile exist
    const {start, end} = req.body;
    //check for start and end date
    if(!start || !end){
      return next(createError(400, "Missing start & end date"));
    }
    profile.availability.push({start: start, end: end});
    profile.save();
    res.status(200).send(profile);
  }catch (err){
    next(createError(500, err.message));
  }
}

exports.editAvailability = async (req, res, next) => {
  try {
    if(!ObjectId.isValid(req.params.id)){
      return next(createError(400, "Invalid Profile id"));
    }
    const {id, start, end} = req.body;
    const filter = {_id: req.params.id, "availability._id": id}
    const update = {$set: {"availability.start": start, "availability.end": end}}
    const updatedProfile = await Profile.findOneAndUpdate(filter, update, {
      new: true
    });
    if(!updatedProfile){
      return next(createError(400, "Profile not found!"))
    }
    res.status(200).send(updatedProfile);
  }catch(err){
    next(createError(500, err.message))
  }
}