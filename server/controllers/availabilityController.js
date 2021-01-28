const createError = require("http-errors");
const Availability = require("../models/availabilityModel");
const ObjectId = require("mongoose").Types.ObjectId;

exports.add = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            return next(createError(400, "No profile id!"));
        }
        if (!ObjectId.isValid(id)) {
            return next(createError(400, "Invalid Profile id!"));
        }

        const{ date, from, to } = req.body;
        //check if date is already available for user
        const findAvailability = await Availability.findOne({
            profileId: id,
            date: date
          });

        //update time interval if date is already available
        if(findAvailability){
            findAvailability.timesAvailable.push({from: from, to: to});
            const availability = await findAvailability.save()
            return res.status(200).send(availability)
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
exports.getAvailability = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { date }= req.query;
        //checks
        if(!date){
            return next(createError(400,"Include date"))
        }
        if (!id) {
            return next(createError(400, "No profile id!"));
        }
        if (!ObjectId.isValid(id)) {
            return next(createError(400, "Invalid Profile id!"));
        }
        //get availability slots for date
        const findAvailabilityList = await Availability.findOne({
            profileId: id,
            date: date
        })
        //check if time slots are found for date
        if(!findAvailabilityList){
            return next(createError(404, `No availability found for ${date}`))
        }
        res.status(200).send(findAvailabilityList.timesAvailable);
    }catch (err){
        next(createError(500, err.message))
    }
}
