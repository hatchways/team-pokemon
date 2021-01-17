const createError = require("http-errors");
const Profile = require("../models/profileModel");
const ObjectId = require("mongoose").Types.ObjectId;

exports.updatePayee = async (req, res, next) => {
  try {
    //check id
    if (!ObjectId.isValid(req.params.id)) {
      return next(createError(400, "Invalid Sitter id"));
    }
    //update sitter's "request" field after payment has gone through stripe
    const updatedPayment = await Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { "requests.$[elem].paid": true, amount: req.body.amount } },
      { arrayFilters: [{ "elem.requests": req.body.jobId }] }
    );
    if (!updatedPayment) {
      return next(createError(404, "Update Failed! Profile does not exist!"));
    }

    res.status(200).send(updatedPayment);
  } catch (err) {
    next(createError(500, err.message));
  }
};
