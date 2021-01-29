const createError = require("http-errors");
const Profile = require("../models/profileModel");
const Request = require("../models/requestModel");
const User = require("../models/userModel");
const ObjectId = require("mongoose").Types.ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Get list of requests for logged in user
exports.getRequests = async (req, res, next) => {
  try {
    // Search through each request in the database and return the ones whose userId or sitterId matches the current user
    const requests = await Request.find({
      $or: [{ ownerId: req.user.id }, { sitterId: req.user.id }],
    })
      .populate([
        { path: "sitterId", model: "User", populate: { path: "profile" } },
        { path: "ownerId", model: "User", populate: { path: "profile" } },
      ])
      .sort({ start: -1 });
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

    if (new Date(end) < new Date(start)) {
      return next(
        createError(400, "End date cannot be earlier than the start date!")
      );
    }

    // Make sure owner and sitter exists
    const user = await User.findById(ownerId);
    const sitter = await User.findById(sitterId);

    if (!user || !sitter) {
      return next(createError(404, "Can't find user!"));
    }

    //check if OWNER has their card(s) added
    await stripe.customers.retrieve(ownerId, async (err, data) => {
      if (err) {
        return next(createError(400, "You have not registered payment"));
      }
      if (data) {
        if (!data.default_source) {
          return next(createError(400, "You have not added payment card"));
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
      }
    });
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
    //populate data into request
    const request = await Request.findById(req.params.id).populate([
      { path: "sitterId", model: "User", populate: { path: "profile" } },
      { path: "ownerId", model: "User", populate: { path: "profile" } },
    ]);

    // Check if request exists
    if (!request) {
      return next(createError(404, "Update Failed! Request does not exist!"));
    }

    // Only the sitter can accept/decline request
    if (request.sitterId._id.toString() !== req.user.id) {
      return next(
        createError(
          401,
          "You are unauthorized to approve or decline this request!"
        )
      );
    }
    // Update request with approved or declined
    // A sitter can decline a request after they've approved it, hence declined is set to the opposite of accepted and vice versa.
    const updatedRequest = await Request.findById(
      { _id: req.params.id },
      async (err, data) => {
        if (err) return err;
        if (declined) {
          updatedRequest.declined = true;
          updatedRequest.accepted = false;
          await updatedRequest.save();
          return res.status(200).send(updatedRequest);
        }
        await stripe.customers.retrieve(
          req.user.id,
          async (error, customer) => {
            if (error) {
              return res.status(403).json({
                error: true,
                message: "You have not registered payment",
              });
            }
            if (customer) {
              if (!customer.metadata.hasOwnProperty("accountId")) {
                return res.status(403).json({
                  error: true,
                  message: "You have no payment card added",
                });
              }
              if (accepted) {
                updatedRequest.accepted = true;
                updatedRequest.declined = false;
              }
              await updatedRequest.save();
              res.status(200).send(updatedRequest);
            }
          }
        );
      }
    );
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.payRequest = async (req, res, next) => {
  try {
    //THIS AMOUNT WILL COME FROM BODY
    const amount = 127.5;

    const fee = Math.round((amount * 0.03 + Number.EPSILON) * 100) / 100;
    //Retrieve a request
    await Request.findById(req.params.id, async (err, data) => {
      if (err)
        return res.status(500).json({
          error: true,
          message: "Database error occured. Please Try again",
        });

      if (data.paid)
        return res.status(400).json({
          error: true,
          message: "This request was already paid",
        });

      if (data.accepted && data.end.getTime() < Date.now()) {
        //Looking for sitter first
        await stripe.customers.retrieve(
          data.sitterId.toString(),
          async (err, sitter) => {
            if (err)
              return res.status(400).json({
                error: true,
                message: "Unable to pay the sitter",
              });
            //Look for owner's customer instance now
            await stripe.customers.retrieve(
              req.user.id,
              async (err, customer) => {
                if (err)
                  return res.status(400).json({
                    error: true,
                    message: "Unable to make payment",
                  });
                //If there is no card added to Owner's account
                if (!customer.default_source) {
                  return res.status(403).json({
                    error: true,
                    message: "No payment card was found",
                  });
                } else {
                  //make a payment
                  const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount * 100,
                    currency: "cad",
                    customer: customer.id.toString(),
                    payment_method: customer.default_source,
                    description: `Request payment from owner ${customer.id} to sitter ${sitter.id} as per request ${data._id}`,
                    application_fee_amount: fee * 100,
                    transfer_data: {
                      destination: sitter.metadata.accountId,
                    },
                    confirm: true,
                  });
                  if (!paymentIntent) {
                    return res.status(403).json({
                      error: true,
                      message: "Unable to make payment",
                    });
                  }
                  data.paid = true;
                  await data.save();
                }
              }
            );
          }
        );
      }
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};
