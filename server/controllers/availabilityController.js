const createError = require("http-errors");
const Availability = require("../models/availabilityModel");
const ObjectId = require("mongoose").Types.ObjectId;

exports.add = async (req, res, next) => {
    try {
        const id = req.params.id;
        const{ date, from, to } = req.body;
        if (!ObjectId.isValid(id)) {
            return next(createError(400, "Invalid Profile id!"));
        }
        //check if date is already available for user
        const findAvailability = await Availability.findOne({
            profileId: id,
            date: date
          });
        //update time interval if date is already available
        if(findAvailability){
            findAvailability.timesAvailable.push({from: from, to: to});
            return res.status(200).send({findAvailability})
        }
        //create new availability 
        const newAvailability = new Availability({
            profileId: id,
            date: date,
            timesAvailable: [
                {from: from, to: to}
            ]
        });
        const savedAvailability = await newAvailability.save();
        res.status(200).send(savedAvailability);
    }catch (err){
        next(createError(500, err.message))
    }
}
