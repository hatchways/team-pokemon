const createError = require("http-errors");
const Profile = require("../models/profileModel");
const Request = require("../models/requestModel");
const User = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;

// Get list of requests for logged in user
exports.getRequests = async (req, res, next) => {
  try {
    // Search through each request in the database and return the ones whose userId or sitterId matches the current user
    const requests = await Request.find({
      $or: [{ ownerId: req.user.id }, { sitterId: req.user.id }],
    });
    res.status(200).send(requests);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Create a new request
exports.createRequest = async (req, res, next) => {
  try {
    const { sitterId, start, end } = req.body;
    const ownerId = req.user.id;

    // Validate user input
    if (!start || !end) {
      return next(createError(400, "Please provide a start and end date"));
    }

    // Make sure owner and sitter exists
    const user = await User.findById(ownerId);
    const sitter = await User.findById(sitterId);

    if (!user || !sitter) {
      return next(createError(404, "Can't find user!"));
    }

    // Create new request
    const newRequest = new Request({
      ownerId,
      sitterId,
      start,
      end,
    });

    const savedRequest = await newRequest.save();

    res.status(201).send(savedRequest);
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Update request with approved or declined
exports.updateRequest = async (req, res, next) => {
  try {
    const { accepted, declined } = req.body;

    // Check if ID is valid
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid Request ID!"));
    }
    const request = await Request.findById(req.params.id);

    // Check if request exists
    if (!request) {
      return next(createError(404, "Update Failed! Request does not exist!"));
    }

    // Only the sitter can accept/decline request
    if (request.sitterId.toString() !== req.user.id) {
      return next(
        createError(
          401,
          "You are unauthorized to approve or decline this request!"
        )
      );
    }

    // Update request with approved or declined
    // A sitter can decline a request after they've approved it, hence declined is set to the opposite of accepted and vice versa.
    if (accepted) {
      request.accepted = true;
      request.declined = false;
    }
    if (declined) {
      request.declined = true;
      request.accepted = false;
    }

    const updatedRequest = await request.save();

    res.status(200).send(updatedRequest);
  } catch (err) {
    next(createError(500, err.message));
  }
};
