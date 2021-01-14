const createError = require("http-errors");
const Profile = require('../models/profileModel');

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
            description
        });
        const savedProfile = await newProfile.save();

        res.status(200).send(savedProfile);
    }catch (err) {
        next(createError(500, err.message));
    }
}
/** 
 * UPDATE /profile/:id 
 * - Given an ID and new parameters, update the profile
*/
exports.updateProfile = async (req, res, next) => {
    try{
        //retrieve profile and update necessary fields
        const updatedProfile = await Profile.findOneAndUpdate(
            {_id: req.params.id},
            { $set: req.body},
            { new: true});
            res.status(200).send(updatedProfile);
    }catch (err){
        next(createError(500, err.message));
    }
}
/**
 * GET /profile/:id
 * - Given an ID, return profile with that ID
 */
exports.getProfile = async (req, res, next) => {
    try{
        const profile = await Profile.findById(req.params.id);
        if (!profile){
            return next(createError(400, "Profile does not exist!"));
        }
        res.status(200).send(profile);
    }catch (err){
        next(createError(500, err.message));
    }
}
/**
 * GET /profile
 * - A list of profiles 
 */
exports.getProfileList = async (req, res, next) => {
    try{
        const profileList = await Profile.find();
        res.status(200).send(profileList);
    }catch (err){
        next(createError(500, err.message));
    }
}